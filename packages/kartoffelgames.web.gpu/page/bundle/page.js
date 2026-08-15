(()=>{var q=class i extends Array{static newListWith(...t){let e=new i;return e.push(...t),e}clear(){this.splice(0,this.length)}clone(){return i.newListWith(...this)}distinct(){return i.newListWith(...new Set(this))}equals(t){if(this===t)return!0;if(!t||this.length!==t.length)return!1;for(let e=0;e<this.length;++e)if(this[e]!==t[e])return!1;return!0}remove(t){let e=this.indexOf(t);if(e!==-1)return this.splice(e,1)[0]}replace(t,e){let r=this.indexOf(t);if(r!==-1){let a=this[r];return this[r]=e,a}}toString(){return`[${super.join(", ")}]`}};var m=class extends Error{mTarget;get target(){return this.mTarget}constructor(t,e,r){super(t,r),this.mTarget=e}};var v=class i extends Map{add(t,e){if(!this.has(t))this.set(t,e);else throw new m("Can't add duplicate key to dictionary.",this)}clone(){return new i(this)}getAllKeysOfValue(t){return[...this.entries()].filter(a=>a[1]===t).map(a=>a[0])}getOrDefault(t,e){let r=this.get(t);return typeof r<"u"?r:e}map(t){let e=new q;for(let r of this){let a=t(r[0],r[1]);e.push(a)}return e}};var rt=class i{static cast(t,e){if(i.exists(t,e))return e}static exists(t,e){return i.valuesOf(t).includes(e)}static namesOf(t){return Object.keys(t).filter(e=>isNaN(Number(e)))}static valuesOf(t){let e=new Array;for(let r of i.namesOf(t))e.push(t[r]);return e}};var A=function(i){return i[i.None=0]="None",i[i.Index=GPUBufferUsage.INDEX]="Index",i[i.Vertex=GPUBufferUsage.VERTEX]="Vertex",i[i.Uniform=GPUBufferUsage.UNIFORM]="Uniform",i[i.Storage=GPUBufferUsage.STORAGE]="Storage",i[i.Indirect=GPUBufferUsage.INDIRECT]="Indirect",i[i.CopySource=GPUBufferUsage.COPY_SRC]="CopySource",i[i.CopyDestination=GPUBufferUsage.COPY_DST]="CopyDestination",i}({});var wt=class{mDeconstruct;mReasons;get deconstruct(){return this.mDeconstruct}set deconstruct(t){if(!t)throw new m("Deconstruct reason can not be reverted. Sadly.",this);this.mDeconstruct=t}constructor(){this.mReasons=new Set,this.mDeconstruct=!1}add(t){this.mReasons.add(t)}any(){return this.mReasons.size>0||this.mDeconstruct}clear(){this.mReasons.clear()}has(t){return this.mReasons.has(t)}};var D=class{mDeconstructed;mDevice;mFreeableResources;mInvalidationReasons;mIsSetup;mNativeObject;mUpdateListener;mUpdateListenerAffectedTyped;get device(){return this.mDevice}get native(){return this.readNative()}get isSetup(){return this.mIsSetup}constructor(t){this.mDevice=t,this.mIsSetup=!1,this.mDeconstructed=!1,this.mNativeObject=null,this.mUpdateListener=new v,this.mUpdateListenerAffectedTyped=new WeakMap,this.mInvalidationReasons=new wt,this.mFreeableResources=new Set,this.mDevice.registerFreeableResource(this,this.mFreeableResources)}addInvalidationListener(t,e,...r){if(this.mUpdateListenerAffectedTyped.has(t))throw new m("Invalidation listener can't be applied twice.",this);let a=[e,...r];for(let n of a)this.mUpdateListener.has(n)||this.mUpdateListener.set(n,new q),this.mUpdateListener.get(n).push(t);return this.mUpdateListenerAffectedTyped.set(t,a),this}deconstruct(){this.mInvalidationReasons.deconstruct=!0,this.mNativeObject!==null&&(this.destroyNative(this.mNativeObject,this.mInvalidationReasons),this.mNativeObject=null),this.mDeconstructed=!0}invalidate(...t){let e=r=>{if(this.mNativeObject!==null&&this.mInvalidationReasons.has(r))return;this.mInvalidationReasons.add(r);let a=this.mUpdateListener.get(r);if(!(!a||a.length===0))if(a.length===1)a[0](r);else for(let n of a)n(r)};if(t.length===1)e(t[0]);else for(let r of t)e(r)}removeInvalidationListener(t){let e=this.mUpdateListenerAffectedTyped.get(t);if(e){for(let r of e)this.mUpdateListener.get(r).remove(t);this.mUpdateListenerAffectedTyped.delete(t)}}setup(t){if(this.mIsSetup)throw new m("Render targets setup can't be called twice.",this);let e={inSetup:!0,device:this.mDevice,data:{}},r=this.onSetupObjectCreate(e);return r!==null&&(t&&t(r),this.onSetup(e.data)),e.inSetup=!1,this.mIsSetup=!0,this}destroyNative(t,e){}ensureSetup(){if(!this.mIsSetup)throw new m("Gpu object must be setup to access properties.",this)}generateNative(t,e){return null}onSetup(t){}onSetupObjectCreate(t){return null}registerFreeableResource(t){this.mFreeableResources.add(t)}unregisterFreeableResource(t){this.mFreeableResources.delete(t)}updateNative(t,e){return!1}readNative(){if(this.mDeconstructed)throw new m("Native GPU object was deconstructed and can't be used again.",this);if(this.isSetup||this.setup(),this.mNativeObject!==null&&this.mInvalidationReasons.any()&&this.updateNative(this.mNativeObject,this.mInvalidationReasons)&&this.mInvalidationReasons.clear(),this.mNativeObject===null||this.mInvalidationReasons.any()){let t=this.mNativeObject;this.mNativeObject=this.generateNative(t,this.mInvalidationReasons),t!==null&&this.destroyNative(t,this.mInvalidationReasons),this.mInvalidationReasons.clear()}return this.mNativeObject}};var Y=class extends D{mResourceUsage;get usage(){return this.mResourceUsage}constructor(t){super(t),this.mResourceUsage=0}extendUsage(t){return(this.mResourceUsage&t)===0&&(this.mResourceUsage=this.mResourceUsage|t,this.invalidate(T.ResourceRebuild)),this}},T=function(i){return i.ResourceRebuild="ResourceRebuild",i}({});var F=class extends Y{mByteSize;mInitialData;mReadBuffer;mWriteBuffer;get native(){return super.native}get size(){return this.mByteSize}set size(t){this.mByteSize=t+3&-4,this.invalidate(T.ResourceRebuild)}get writeBufferLimitation(){return this.mWriteBuffer.limitation}set writeBufferLimitation(t){this.mWriteBuffer.limitation=t}constructor(t,e){super(t),this.mByteSize=e+3&-4,this.extendUsage(A.CopyDestination),this.extendUsage(A.CopySource),this.mWriteBuffer={limitation:Number.MAX_SAFE_INTEGER,ready:new Array,buffer:new Set},this.mReadBuffer=null,this.mInitialData=null}initialData(t){if(this.mInitialData!==null)throw new m("Initial callback can only be set once.",this);return this.mInitialData=t,this}async read(t,e){this.extendUsage(A.CopySource);let r=t??0,a=e??this.size-r;this.mReadBuffer===null&&(this.mReadBuffer=this.device.gpu.createBuffer({label:"ReadWaveBuffer",size:this.size,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST,mappedAtCreation:!1}),this.registerFreeableResource(this.mReadBuffer));let n=this.device.gpu.createCommandEncoder();n.copyBufferToBuffer(this.native,r,this.mReadBuffer,r,a),this.device.gpu.queue.submit([n.finish()]),await this.mReadBuffer.mapAsync(GPUMapMode.READ,r,a);let s=this.mReadBuffer.getMappedRange(r,a).slice(0);return this.mReadBuffer.unmap(),s}write(t,e,r,a){this.extendUsage(A.CopyDestination);let n=this.native,s=null;this.mWriteBuffer.ready.length===0?this.mWriteBuffer.buffer.size<this.mWriteBuffer.limitation&&(s=this.device.gpu.createBuffer({label:`RingBuffer-WriteWaveBuffer-${this.mWriteBuffer.buffer.size}`,size:this.size,usage:GPUBufferUsage.MAP_WRITE|GPUBufferUsage.COPY_SRC,mappedAtCreation:!0}),this.registerFreeableResource(s),this.mWriteBuffer.buffer.add(s)):s=this.mWriteBuffer.ready.pop();let l=t;ArrayBuffer.isView(l)&&(l=l.buffer);let c=e??0,u=r??0,h=a??l.byteLength;if(u%8!==0)throw new m(`Data byte offset (${u}) must be a multiple of 8.`,this);if(h%4!==0)throw new m(`Data byte length (${h}) must be a multiple of 4.`,this);if(!s){this.device.gpu.queue.writeBuffer(n,c,l,u,h);return}let f=s.getMappedRange(c,h);new Int8Array(f).set(new Int8Array(l,u,h)),s.unmap();let x=this.device.gpu.createCommandEncoder();x.copyBufferToBuffer(s,c,n,c,h),this.device.gpu.queue.submit([x.finish()]),s.mapAsync(GPUMapMode.WRITE).then(()=>{this.mWriteBuffer.buffer.has(s)&&this.mWriteBuffer.ready.push(s)}).catch(()=>{this.mWriteBuffer.buffer.delete(s),s.destroy(),this.unregisterFreeableResource(s)})}destroyNative(t){t.destroy(),this.unregisterFreeableResource(t);for(let e of this.mWriteBuffer.buffer)e.destroy(),this.unregisterFreeableResource(e);for(this.mWriteBuffer.buffer.clear();this.mWriteBuffer.ready.length>0;)this.mWriteBuffer.ready.pop()}generateNative(t){let e=this.device.gpu.createBuffer({label:"Ring-Buffer-Static-Buffer",size:this.size,usage:this.usage,mappedAtCreation:!!this.mInitialData});if(this.registerFreeableResource(e),this.mInitialData){let r=this.mInitialData;ArrayBuffer.isView(r)&&(r=r.buffer);let a=e.getMappedRange();if(a.byteLength!==r.byteLength)throw new m(`Initial buffer data (byte-length: ${r.byteLength}) does not fit into buffer (length: ${a.byteLength}). `,this);new Int8Array(a).set(new Int8Array(r)),e.unmap(),this.mInitialData=void 0}if(t){let r=this.device.gpu.createCommandEncoder();r.copyBufferToBuffer(t,0,e,0,Math.min(t.size,e.size)),this.device.gpu.queue.submit([r.finish()])}return e}};var y=function(i){return i.Float32="float32",i.Uint32="uint32",i.Sint32="sint32",i.Float16="float16",i.Uint8="uint8",i.Sint8="sint8",i.Uint16="uint16",i.Sint16="sint16",i.Unorm16="unorm16",i.Snorm16="snorm16",i.Unorm8="unorm8",i.Snorm8="snorm8",i}({});var L=function(i){return i.Single="x1",i.Vector2="v2",i.Vector3="v3",i.Vector4="v4",i.Matrix22="m22",i.Matrix23="m23",i.Matrix24="m24",i.Matrix32="m32",i.Matrix33="m33",i.Matrix34="m34",i.Matrix42="m42",i.Matrix43="m43",i.Matrix44="m44",i}({});var at=function(i){return i.Never="never",i.Less="less",i.Equal="equal",i.LessEqual="less-equal",i.Greater="greater",i.NotEqual="not-equal",i.GreaterEqual="greater-equal",i.Allways="always",i}({});var S=function(i){return i[i.None=0]="None",i[i.Fragment=GPUShaderStage.FRAGMENT]="Fragment",i[i.Vertex=GPUShaderStage.VERTEX]="Vertex",i[i.Compute=GPUShaderStage.COMPUTE]="Compute",i}({});var G=function(i){return i.DepthClipControl="depth-clip-control",i.Depth32floatStencil8="depth32float-stencil8",i.TextureCompressionBc="texture-compression-bc",i.TextureCompressionBcSliced3d="texture-compression-bc-sliced-3d",i.TextureCompressionEtc2="texture-compression-etc2",i.TextureCompressionAstc="texture-compression-astc",i.TimestampQuery="timestamp-query",i.IndirectFirstInstance="indirect-first-instance",i.ShaderF16="shader-f16",i.Rg11b10ufloatRenderable="rg11b10ufloat-renderable",i.Bgra8unormStorage="bgra8unorm-storage",i.Float32Filterable="float32-filterable",i.ClipDistances="clip-distances",i.DualSourceBlendin="dual-source-blending",i}({});var K=function(i){return i.None="none",i.Front="front",i.Back="back",i}({});var nt=function(i){return i.Filter="filtering",i.NoneFiltering="non-filtering",i.Comparison="comparison",i}({});var B=function(i){return i[i.None=0]="None",i[i.Read=1]="Read",i[i.Write=2]="Write",i[i.ReadWrite=4]="ReadWrite",i}({});var U=function(i){return i.Constant="constant",i.Dst="dst",i.DstAlpha="dst-alpha",i.One="one",i.OneMinusConstant="one-minus-constant",i.OneMinusDst="one-minus-dst",i.OneMinusDstAlpha="one-minus-dst-alpha",i.OneMinusSrc="one-minus-src",i.OneMinusSrcAlpha="one-minus-src-alpha",i.Src="src",i.SrcAlpha="src-alpha",i.SrcAlphaSaturated="src-alpha-saturated",i.Zero="zero",i}({});var it=function(i){return i.Add="add",i.Subtract="subtract",i.ReverseSubtract="reverse-subtract",i.Min="min",i.Max="max",i}({});var O=function(i){return i.Vertex="vertex-step",i.Index="index-step",i.Instance="instance-step",i}({});var C=function(i){return i.MaxTextureDimension1D="maxTextureDimension1D",i.MaxTextureDimension2D="maxTextureDimension2D",i.MaxTextureDimension3D="maxTextureDimension3D",i.MaxTextureArrayLayers="maxTextureArrayLayers",i.MaxBindGroups="maxBindGroups",i.MaxBindGroupsPlusVertexBuffers="maxBindGroupsPlusVertexBuffers",i.MaxBindingsPerBindGroup="maxBindingsPerBindGroup",i.MaxDynamicUniformBuffersPerPipelineLayout="maxDynamicUniformBuffersPerPipelineLayout",i.MaxDynamicStorageBuffersPerPipelineLayout="maxDynamicStorageBuffersPerPipelineLayout",i.MaxSampledTexturesPerShaderStage="maxSampledTexturesPerShaderStage",i.MaxSamplersPerShaderStage="maxSamplersPerShaderStage",i.MaxStorageBuffersPerShaderStage="maxStorageBuffersPerShaderStage",i.MaxStorageTexturesPerShaderStage="maxStorageTexturesPerShaderStage",i.MaxUniformBuffersPerShaderStage="maxUniformBuffersPerShaderStage",i.MaxUniformBufferBindingSize="maxUniformBufferBindingSize",i.MaxStorageBufferBindingSize="maxStorageBufferBindingSize",i.MinUniformBufferOffsetAlignment="minUniformBufferOffsetAlignment",i.MinStorageBufferOffsetAlignment="minStorageBufferOffsetAlignment",i.MaxVertexBuffers="maxVertexBuffers",i.MaxBufferSize="maxBufferSize",i.MaxVertexAttributes="maxVertexAttributes",i.MaxVertexBufferArrayStride="maxVertexBufferArrayStride",i.MaxInterStageShaderVariables="maxInterStageShaderVariables",i.MaxColorAttachments="maxColorAttachments",i.MaxColorAttachmentBytesPerSample="maxColorAttachmentBytesPerSample",i.MaxComputeWorkgroupStorageSize="maxComputeWorkgroupStorageSize",i.MaxComputeInvocationsPerWorkgroup="maxComputeInvocationsPerWorkgroup",i.MaxComputeWorkgroupSizeX="maxComputeWorkgroupSizeX",i.MaxComputeWorkgroupSizeY="maxComputeWorkgroupSizeY",i.MaxComputeWorkgroupSizeZ="maxComputeWorkgroupSizeZ",i.MaxComputeWorkgroupsPerDimension="maxComputeWorkgroupsPerDimension",i}({});var vt=class{mComputeResourceBuffer;mEncoder;constructor(t){this.mEncoder=t,this.mComputeResourceBuffer={pipeline:null,pipelineDataGroupList:new Array,highestBindGroupListIndex:-1}}computeDirect(t,e,r=1,a=1,n=1){if(t.layout!==e.layout)throw new m("Pipline data not valid for set pipeline.",this);this.setupEncoderData(t,e)&&this.mEncoder.dispatchWorkgroups(r,a,n)}computeIndirect(t,e,r){if(t.layout!==e.layout)throw new m("Pipline data not valid for set pipeline.",this);if(r.extendUsage(A.Indirect),this.setupEncoderData(t,e))if(r.size===20)this.mEncoder.dispatchWorkgroupsIndirect(r.native,0);else throw new m("Indirect compute calls can only be done with 20 or 16 byte long buffers",this)}setupEncoderData(t,e){let r=t.native;if(r===null)return!1;let a=-1,n=e.data;for(let s=0;s<n.length;s++){let l=n[s],c=this.mComputeResourceBuffer.pipelineDataGroupList[s];s>a&&(a=s),(!c||l.bindGroup!==c.bindGroup||l.offsetId!==c.offsetId)&&(this.mComputeResourceBuffer.pipelineDataGroupList[s]=l,l.bindGroup.layout.hasDynamicOffset?this.mEncoder.setBindGroup(s,l.bindGroup.native,l.offsets):this.mEncoder.setBindGroup(s,l.bindGroup.native))}if(t!==this.mComputeResourceBuffer.pipeline){if(this.mComputeResourceBuffer.pipeline=t,this.mEncoder.setPipeline(r),this.mComputeResourceBuffer.highestBindGroupListIndex>a)for(let s=a+1;s<this.mComputeResourceBuffer.highestBindGroupListIndex+1;s++)this.mEncoder.setBindGroup(s,null);this.mComputeResourceBuffer.highestBindGroupListIndex=a}return!0}};var Dt=class extends D{mExecutionContext;mQueries;constructor(t,e){super(t),this.mQueries={},this.mExecutionContext=e}execute(t){let e={};this.mQueries.timestamp&&(e.timestampWrites=this.mQueries.timestamp.query);let r=this.mExecutionContext.commandEncoder.beginComputePass(e);t(new vt(r)),r.end(),this.mQueries.timestamp&&this.mExecutionContext.commandEncoder.resolveQuerySet(this.mQueries.timestamp.query.querySet,0,2,this.mQueries.timestamp.buffer.native,0)}async probeTimestamp(){if(!this.device.capabilities.hasFeature(G.TimestampQuery))return[0n,0n];if(!this.mQueries.timestamp){let t=this.device.gpu.createQuerySet({type:"timestamp",count:2}),e=new F(this.device,16);e.extendUsage(GPUBufferUsage.QUERY_RESOLVE),e.extendUsage(A.CopySource),this.mQueries.timestamp={query:{querySet:t,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1},buffer:e,resolver:null}}return this.mQueries.timestamp.resolver?this.mQueries.timestamp.resolver:(this.mQueries.timestamp.resolver=this.mQueries.timestamp.buffer.read(0,16).then(t=>{this.mQueries.timestamp.resolver=null;let e=new BigUint64Array(t);return[e[0],e[1]]}),this.mQueries.timestamp.resolver)}};var St=class{mEncoder;mRecordResources;mRenderResourceBuffer;mRenderTargets;mUsedResources;get usedResources(){return this.mUsedResources}constructor(t,e,r){this.mEncoder=t,this.mRenderTargets=e,this.mRecordResources=r,this.mUsedResources={parameter:new Set,indirectBuffer:new Set,pipelines:new Set,pipelineData:new Set},this.mRenderResourceBuffer={pipeline:null,vertexBuffer:new v,highestVertexParameterIndex:-1,pipelineDataGroupList:new Array,highestBindGroupListIndex:-1}}drawDirect(t,e,r,a=1,n=0){if(this.mRenderTargets.layout!==t.renderTargets)throw new m("Pipelines render targets not valid for this render pass.",this);if(e.layout!==t.module.vertexParameter)throw new m("Vertex parameter not valid for set pipeline.",this);if(t.layout!==r.layout)throw new m("Pipline data not valid for set pipeline.",this);this.mRecordResources&&(this.mUsedResources.pipelines.has(t)||this.mUsedResources.pipelines.add(t),this.mUsedResources.parameter.has(e)||this.mUsedResources.parameter.add(e),this.mUsedResources.pipelineData.has(r)||this.mUsedResources.pipelineData.add(r)),this.setupEncoderData(t,e,r)&&this.executeDirectDraw(e,a,n)}drawIndirect(t,e,r,a){if(a.extendUsage(A.Indirect),this.mRenderTargets.layout!==t.renderTargets)throw new m("Pipelines render targets not valid for this render pass.",this);if(e.layout!==t.module.vertexParameter)throw new m("Vertex parameter not valid for set pipeline.",this);if(t.layout!==r.layout)throw new m("Pipline data not valid for set pipeline.",this);this.mRecordResources&&(this.mUsedResources.pipelines.has(t)||this.mUsedResources.pipelines.add(t),this.mUsedResources.parameter.has(e)||this.mUsedResources.parameter.add(e),this.mUsedResources.pipelineData.has(r)||this.mUsedResources.pipelineData.add(r)),this.setupEncoderData(t,e,r)&&this.executeIndirectDraw(e,a)}setupEncoderData(t,e,r){let a=t.native;if(a===null)return!1;let n=-1,s=r.data;for(let u=0;u<s.length;u++){let h=s[u],f=this.mRenderResourceBuffer.pipelineDataGroupList[u];u>n&&(n=u),(!f||h.bindGroup!==f.bindGroup||h.offsetId!==f.offsetId)&&(this.mRenderResourceBuffer.pipelineDataGroupList[u]=h,h.bindGroup.layout.hasDynamicOffset?this.mEncoder.setBindGroup(u,h.bindGroup.native,h.offsets):this.mEncoder.setBindGroup(u,h.bindGroup.native))}let l=-1,c=t.module.vertexParameter.bufferNames;for(let u=0;u<c.length;u++){let h=c[u],f=e.get(h);u>l&&(l=u),f!==this.mRenderResourceBuffer.vertexBuffer.get(u)&&(this.mRenderResourceBuffer.vertexBuffer.set(u,f),this.mEncoder.setVertexBuffer(u,f.native))}if(t!==this.mRenderResourceBuffer.pipeline){if(this.mRenderResourceBuffer.pipeline=t,this.mEncoder.setPipeline(a),this.mRenderResourceBuffer.highestBindGroupListIndex>n)for(let u=n+1;u<this.mRenderResourceBuffer.highestBindGroupListIndex+1;u++);if(this.mRenderResourceBuffer.highestBindGroupListIndex=n,this.mRenderResourceBuffer.highestVertexParameterIndex>l)for(let u=l+1;u<this.mRenderResourceBuffer.highestVertexParameterIndex+1;u++);this.mRenderResourceBuffer.highestVertexParameterIndex=l}return!0}executeDirectDraw(t,e,r){t.layout.indexable?(t.indexBufferFormat===Uint16Array?this.mEncoder.setIndexBuffer(t.indexBuffer.native,"uint16"):this.mEncoder.setIndexBuffer(t.indexBuffer.native,"uint32"),this.mEncoder.drawIndexed(t.vertexCount,e,0,0,r)):this.mEncoder.draw(t.vertexCount,e,0,r)}executeIndirectDraw(t,e){if(e.size===20){if(!t.layout.indexable)throw new m("Indirect indexed draw call failed, because parameter are not indexable",this);t.indexBufferFormat===Uint16Array?this.mEncoder.setIndexBuffer(t.indexBuffer.native,"uint16"):this.mEncoder.setIndexBuffer(t.indexBuffer.native,"uint32"),this.mEncoder.drawIndexedIndirect(e.native,0)}else if(e.size===16)this.mEncoder.drawIndirect(e.native,0);else throw new m("Indirect draw calls can only be done with 20 or 16 byte long buffers",this)}};var Ct=class extends D{mExecutionContext;mQueries;mRenderTargets;constructor(t,e,r){super(t),this.mQueries={},this.mRenderTargets=e,this.mExecutionContext=r}execute(t){let e=this.mRenderTargets.native;this.mQueries.timestamp&&(e.timestampWrites=this.mQueries.timestamp.query);let r=this.mExecutionContext.commandEncoder.beginRenderPass(e);t(new St(r,this.mRenderTargets,!1)),r.end(),this.mQueries.timestamp&&this.mExecutionContext.commandEncoder.resolveQuerySet(this.mQueries.timestamp.query.querySet,0,2,this.mQueries.timestamp.buffer.native,0),this.mQueries.timestamp&&this.mQueries.timestamp.query.querySet.destroy()}async probeTimestamp(){if(!this.device.capabilities.hasFeature(G.TimestampQuery))return[0n,0n];if(!this.mQueries.timestamp){let t=this.device.gpu.createQuerySet({type:"timestamp",count:2}),e=new F(this.device,16);e.extendUsage(GPUBufferUsage.QUERY_RESOLVE),e.extendUsage(A.CopySource),this.mQueries.timestamp={query:{querySet:t,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1},buffer:e,resolver:null}}return this.mQueries.timestamp.resolver?this.mQueries.timestamp.resolver:(this.mQueries.timestamp.resolver=this.mQueries.timestamp.buffer.read(0,16).then(t=>{this.mQueries.timestamp.resolver=null;let e=new BigUint64Array(t);return[e[0],e[1]]}),this.mQueries.timestamp.resolver)}};var Lt=class extends D{mCommandEncoder;get commandEncoder(){return this.mCommandEncoder}constructor(t,e){super(t),this.mCommandEncoder=e}computePass(t){new Dt(this.device,this).execute(t)}renderPass(t,e){new Ct(this.device,t,this).execute(e)}};var Tt=class extends D{constructor(t){super(t)}execute(t){let e=this.device.gpu.createCommandEncoder({label:"Execution"});t(new Lt(this.device,e)),this.device.gpu.queue.submit([e.finish()])}};var Rt=class{mFeatures;mLimits;constructor(t){this.mFeatures=new Set;for(let e of t.features){let r=rt.cast(G,e);r&&this.mFeatures.add(r)}this.mLimits=new v;for(let e of rt.valuesOf(C))this.mLimits.set(e,t.limits[e]??null)}getLimit(t){return this.mLimits.get(t)}hasFeature(t){return this.mFeatures.has(t)}};var o=function(i){return i.Red="red",i.Green="green",i.Blue="blue",i.Alpha="alpha",i.Stencil="stencil",i.Depth="depth",i}({});var d=function(i){return i.Float="float",i.SignedInteger="sint",i.UnsignedInteger="uint",i.UnfilterableFloat="unfilterable-float",i.Depth="depth",i}({});var E=function(i){return i[i.None=0]="None",i[i.CopySource=GPUTextureUsage.COPY_SRC]="CopySource",i[i.CopyDestination=GPUTextureUsage.COPY_DST]="CopyDestination",i[i.TextureBinding=GPUTextureUsage.TEXTURE_BINDING]="TextureBinding",i[i.Storage=GPUTextureUsage.STORAGE_BINDING]="Storage",i[i.RenderAttachment=GPUTextureUsage.RENDER_ATTACHMENT]="RenderAttachment",i}({});var Bt=class{mDevice;mFormatCapabilitys;get preferredCanvasFormat(){return globalThis.navigator.gpu.getPreferredCanvasFormat()}constructor(t){this.mDevice=t,this.mFormatCapabilitys=this.constructFormatCapability()}capabilityOf(t){let e=this.mFormatCapabilitys.get(t);if(!e)throw new m(`Format "${t}" not defined.`,this);let r=new Set;return e.usage.copy&&((e.usage.copy.imageSource||e.usage.copy.textureSource)&&r.add(E.CopySource),(e.usage.copy.imageDestination||e.usage.copy.textureDestination)&&r.add(E.CopyDestination)),e.usage.textureBinding&&r.add(E.TextureBinding),e.usage.storage&&r.add(E.Storage),e.usage.renderAttachment&&r.add(E.RenderAttachment),{format:e.format,copyCompatible:new Set(e.usage.copy?e.usage.copy.compatible:[]),textureUsages:r,dimensions:new Set(e.dimensions),aspects:new Set(e.aspect.types),sampleTypes:new Set(e.type),renderAttachment:{resolveTarget:e.usage.renderAttachment?e.usage.renderAttachment.resolveTarget:!1,multisample:e.usage.renderAttachment?e.usage.renderAttachment.multisample:!1,blendable:e.usage.renderAttachment?e.usage.renderAttachment.blendable:!1},storage:{readonly:e.usage.storage?e.usage.storage.readonly:!1,writeonly:e.usage.storage?e.usage.storage.writeonly:!1,readwrite:e.usage.storage?e.usage.storage.readwrite:!1},copy:{textureSource:e.usage.copy?e.usage.copy.textureSource:!1,textureTarget:e.usage.copy?e.usage.copy.textureDestination:!1,imageSource:e.usage.copy?e.usage.copy.imageSource:!1,imageTarget:e.usage.copy?e.usage.copy.imageDestination:!1}}}filterFormatFor(t){for(let e of this.mFormatCapabilitys.values())if(!(t.sampleType&&!e.type.includes(t.sampleType))&&e.aspect.byteCost===t.bytePerAspect&&!(t.aspects&&(e.aspect.types.length!==t.aspects.length||!e.aspect.types.every(r=>t.aspects.includes(r))))&&!(t.dimension&&!e.dimensions.includes(t.dimension))&&!(t.renderAttachment&&(!e.usage.renderAttachment||e.usage.renderAttachment.blendable!==t.renderAttachment.blendable||e.usage.renderAttachment.multisample!==t.renderAttachment.multisample||e.usage.renderAttachment.resolveTarget!==t.renderAttachment.resolveTarget)))return e.format;return null}constructFormatCapability(){let t=new Map,e=[d.UnfilterableFloat];if(this.mDevice.capabilities.hasFeature(G.Float32Filterable)&&e.push(d.Float),t.set("r8unorm",{format:"r8unorm",aspect:{types:[o.Red],byteCost:1},dimensions:["1d","2d","3d"],type:[d.Float,d.UnfilterableFloat],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!0,blendable:!0,multisample:!0},copy:{compatible:["r8unorm"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),t.set("r8snorm",{format:"r8snorm",aspect:{types:[o.Red],byteCost:1},dimensions:["1d","2d","3d"],type:[d.Float,d.UnfilterableFloat],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:!1,copy:{compatible:["r8snorm"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),t.set("r8uint",{format:"r8uint",aspect:{types:[o.Red],byteCost:1},dimensions:["1d","2d","3d"],type:[d.UnsignedInteger],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["r8uint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),t.set("r8sint",{format:"r8sint",aspect:{types:[o.Red],byteCost:1},dimensions:["1d","2d","3d"],type:[d.SignedInteger],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["r8sint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),t.set("r16uint",{format:"r16uint",aspect:{types:[o.Red],byteCost:2},dimensions:["1d","2d","3d"],type:[d.UnsignedInteger],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["r16uint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),t.set("r16sint",{format:"r16sint",aspect:{types:[o.Red],byteCost:2},dimensions:["1d","2d","3d"],type:[d.SignedInteger],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["r16sint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),t.set("r16float",{format:"r16float",aspect:{types:[o.Red],byteCost:2},dimensions:["1d","2d","3d"],type:[d.Float,d.UnfilterableFloat],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!0,blendable:!0,multisample:!0},copy:{compatible:["r16float"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),t.set("rg8unorm",{format:"rg8unorm",aspect:{types:[o.Red,o.Green],byteCost:1},dimensions:["1d","2d","3d"],type:[d.Float,d.UnfilterableFloat],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!0,blendable:!0,multisample:!0},copy:{compatible:["rg8unorm"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),t.set("rg8snorm",{format:"rg8snorm",aspect:{types:[o.Red,o.Green],byteCost:1},dimensions:["1d","2d","3d"],type:[d.Float,d.UnfilterableFloat],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:!1,copy:{compatible:["rg8snorm"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),t.set("rg8uint",{format:"rg8uint",aspect:{types:[o.Red,o.Green],byteCost:1},dimensions:["1d","2d","3d"],type:[d.UnsignedInteger],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["rg8uint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),t.set("rg8sint",{format:"rg8sint",aspect:{types:[o.Red,o.Green],byteCost:1},dimensions:["1d","2d","3d"],type:[d.SignedInteger],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["rg8sint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),t.set("r32uint",{format:"r32uint",aspect:{types:[o.Red],byteCost:4},dimensions:["1d","2d","3d"],type:[d.UnsignedInteger],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!1},copy:{compatible:["r32uint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:{readonly:!0,writeonly:!0,readwrite:!0}}}),t.set("r32sint",{format:"r32sint",aspect:{types:[o.Red],byteCost:4},dimensions:["1d","2d","3d"],type:[d.SignedInteger],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!1},copy:{compatible:["r32sint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:{readonly:!0,writeonly:!0,readwrite:!0}}}),t.set("r32float",{format:"r32float",aspect:{types:[o.Red],byteCost:4},dimensions:["1d","2d","3d"],type:e,compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["r32float"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:{readonly:!0,writeonly:!0,readwrite:!0}}}),t.set("rg16uint",{format:"rg16uint",aspect:{types:[o.Red,o.Green],byteCost:2},dimensions:["1d","2d","3d"],type:[d.UnsignedInteger],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["rg16uint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),t.set("rg16sint",{format:"rg16sint",aspect:{types:[o.Red,o.Green],byteCost:2},dimensions:["1d","2d","3d"],type:[d.SignedInteger],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["rg16sint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),t.set("rg16float",{format:"rg16float",aspect:{types:[o.Red,o.Green],byteCost:2},dimensions:["1d","2d","3d"],type:[d.Float,d.UnfilterableFloat],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!0,blendable:!0,multisample:!0},copy:{compatible:["rg16float"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),t.set("rgba8unorm",{format:"rgba8unorm",aspect:{types:[o.Red,o.Green,o.Blue,o.Alpha],byteCost:1},dimensions:["1d","2d","3d"],type:[d.Float,d.UnfilterableFloat],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!0,blendable:!0,multisample:!0},copy:{compatible:["rgba8unorm","rgba8unorm-srgb"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:{readonly:!0,writeonly:!0,readwrite:!1}}}),t.set("rgba8unorm-srgb",{format:"rgba8unorm-srgb",aspect:{types:[o.Red,o.Green,o.Blue,o.Alpha],byteCost:1},dimensions:["1d","2d","3d"],type:[d.Float,d.UnfilterableFloat],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!0,blendable:!0,multisample:!0},copy:{compatible:["rgba8unorm-srgb","rgba8unorm"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),t.set("rgba8snorm",{format:"rgba8snorm",aspect:{types:[o.Red,o.Green,o.Blue,o.Alpha],byteCost:1},dimensions:["1d","2d","3d"],type:[d.Float,d.UnfilterableFloat],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:!1,copy:{compatible:["rgba8snorm"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:{readonly:!0,writeonly:!0,readwrite:!1}}}),t.set("rgba8uint",{format:"rgba8uint",aspect:{types:[o.Red,o.Green,o.Blue,o.Alpha],byteCost:1},dimensions:["1d","2d","3d"],type:[d.UnsignedInteger],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["rgba8uint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:{readonly:!0,writeonly:!0,readwrite:!1}}}),t.set("rgba8sint",{format:"rgba8sint",aspect:{types:[o.Red,o.Green,o.Blue,o.Alpha],byteCost:1},dimensions:["1d","2d","3d"],type:[d.SignedInteger],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["rgba8sint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:{readonly:!0,writeonly:!0,readwrite:!1}}}),t.set("bgra8unorm",{format:"bgra8unorm",aspect:{types:[o.Red,o.Green,o.Blue,o.Alpha],byteCost:1},dimensions:["1d","2d","3d"],type:[d.Float,d.UnfilterableFloat],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!0,blendable:!0,multisample:!0},copy:{compatible:["bgra8unorm","bgra8unorm-srgb"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:{readonly:this.mDevice.capabilities.hasFeature(G.Bgra8unormStorage),writeonly:!1,readwrite:!1}}}),t.set("bgra8unorm-srgb",{format:"bgra8unorm-srgb",aspect:{types:[o.Red,o.Green,o.Blue,o.Alpha],byteCost:1},dimensions:["1d","2d","3d"],type:[d.Float,d.UnfilterableFloat],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!0,blendable:!0,multisample:!0},copy:{compatible:["bgra8unorm-srgb","bgra8unorm"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),t.set("rgb9e5ufloat",{format:"rgb9e5ufloat",aspect:{types:[o.Red,o.Green,o.Blue,o.Alpha],byteCost:1},dimensions:["1d","2d","3d"],type:[d.Float,d.UnfilterableFloat],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:!1,copy:{compatible:["rgb9e5ufloat"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),t.set("rgb10a2uint",{format:"rgb10a2uint",aspect:{types:[o.Red,o.Green,o.Blue,o.Alpha],byteCost:2},dimensions:["1d","2d","3d"],type:[d.UnsignedInteger],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["rgb10a2uint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),t.set("rgb10a2unorm",{format:"rgb10a2unorm",aspect:{types:[o.Red,o.Green,o.Blue,o.Alpha],byteCost:2},dimensions:["1d","2d","3d"],type:[d.Float,d.UnfilterableFloat],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!0,blendable:!0,multisample:!0},copy:{compatible:["rgb10a2unorm"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),t.set("rg11b10ufloat",{format:"rg11b10ufloat",aspect:{types:[o.Red,o.Green,o.Blue,o.Alpha],byteCost:2},dimensions:["1d","2d","3d"],type:[d.Float,d.UnfilterableFloat],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:this.mDevice.capabilities.hasFeature(G.Rg11b10ufloatRenderable)?{resolveTarget:!0,blendable:!0,multisample:!0}:!1,copy:{compatible:["rg11b10ufloat"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),t.set("rg32uint",{format:"rg32uint",aspect:{types:[o.Red,o.Green],byteCost:4},dimensions:["1d","2d","3d"],type:[d.UnsignedInteger],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!1},copy:{compatible:["rg32uint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:{readonly:!0,writeonly:!0,readwrite:!1}}}),t.set("rg32sint",{format:"rg32sint",aspect:{types:[o.Red,o.Green],byteCost:4},dimensions:["1d","2d","3d"],type:[d.SignedInteger],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!1},copy:{compatible:["rg32sint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:{readonly:!0,writeonly:!0,readwrite:!1}}}),t.set("rg32float",{format:"rg32float",aspect:{types:[o.Red,o.Green],byteCost:4},dimensions:["1d","2d","3d"],type:e,compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!1},copy:{compatible:["rg32float"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:{readonly:!0,writeonly:!0,readwrite:!1}}}),t.set("rgba16uint",{format:"rgba16uint",aspect:{types:[o.Red,o.Green,o.Blue,o.Alpha],byteCost:2},dimensions:["1d","2d","3d"],type:[d.UnsignedInteger],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["rgba16uint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:{readonly:!0,writeonly:!0,readwrite:!1}}}),t.set("rgba16sint",{format:"rgba16sint",aspect:{types:[o.Red,o.Green,o.Blue,o.Alpha],byteCost:2},dimensions:["1d","2d","3d"],type:[d.SignedInteger],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["rgba16sint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:{readonly:!0,writeonly:!0,readwrite:!1}}}),t.set("rgba16float",{format:"rgba16float",aspect:{types:[o.Red,o.Green,o.Blue,o.Alpha],byteCost:2},dimensions:["1d","2d","3d"],type:[d.Float,d.UnfilterableFloat],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!0,blendable:!0,multisample:!0},copy:{compatible:["rgba16float"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:{readonly:!0,writeonly:!0,readwrite:!1}}}),t.set("rgba32uint",{format:"rgba32uint",aspect:{types:[o.Red,o.Green,o.Blue,o.Alpha],byteCost:4},dimensions:["1d","2d","3d"],type:[d.UnsignedInteger],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!1},copy:{compatible:["rgba32uint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:{readonly:!0,writeonly:!0,readwrite:!1}}}),t.set("rgba32sint",{format:"rgba32sint",aspect:{types:[o.Red,o.Green,o.Blue,o.Alpha],byteCost:4},dimensions:["1d","2d","3d"],type:[d.SignedInteger],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!1},copy:{compatible:["rgba32sint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:{readonly:!0,writeonly:!0,readwrite:!1}}}),t.set("rgba32float",{format:"rgba32float",aspect:{types:[o.Red,o.Green,o.Blue,o.Alpha],byteCost:4},dimensions:["1d","2d","3d"],type:e,compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!1},copy:{compatible:["rgba32float"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:{readonly:!0,writeonly:!0,readwrite:!1}}}),t.set("stencil8",{format:"stencil8",aspect:{types:[o.Stencil],byteCost:1},dimensions:["1d","2d"],type:[d.UnsignedInteger],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["stencil8"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),t.set("depth16unorm",{format:"depth16unorm",aspect:{types:[o.Depth],byteCost:2},dimensions:["1d","2d"],type:[d.Depth,d.UnfilterableFloat],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["depth16unorm"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),t.set("depth24plus",{format:"depth24plus",aspect:{types:[o.Depth],byteCost:4},dimensions:["1d","2d"],type:[d.Depth,d.UnfilterableFloat],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["depth24plus"],textureSource:!0,textureDestination:!0,imageSource:!1,imageDestination:!1},storage:!1}}),t.set("depth24plusStencil8",{format:"depth24plusStencil8",aspect:{types:[o.Depth,o.Stencil],byteCost:2},dimensions:["1d","2d"],type:[d.Depth,d.UnfilterableFloat,d.UnsignedInteger],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["depth24plusStencil8"],textureSource:!0,textureDestination:!0,imageSource:!1,imageDestination:!1},storage:!1}}),t.set("depth32float",{format:"depth32float",aspect:{types:[o.Depth],byteCost:4},dimensions:["1d","2d"],type:[d.Depth,d.UnfilterableFloat],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["depth32float"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!1},storage:!1}}),this.mDevice.capabilities.hasFeature(G.Depth32floatStencil8)&&t.set("depth32floatStencil8",{format:"depth32floatStencil8",aspect:{types:[o.Depth,o.Stencil],byteCost:4},dimensions:["1d","2d"],type:[d.Depth,d.UnfilterableFloat,d.UnsignedInteger],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["depth32floatStencil8"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!1},storage:!1}}),this.mDevice.capabilities.hasFeature(G.TextureCompressionBc)){let r=(a,n,s,l)=>{let c={format:a,aspect:{types:n,byteCost:s},dimensions:["1d","2d"],type:[d.UnfilterableFloat,d.Float],compressionBlock:{width:4,height:4},usage:{textureBinding:!0,renderAttachment:!1,copy:{compatible:[a,...l],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}};return this.mDevice.capabilities.hasFeature(G.TextureCompressionBcSliced3d)&&c.dimensions.push("3d"),c};t.set("bc1-rgba-unorm",r("bc1-rgba-unorm",[o.Red,o.Green,o.Blue,o.Alpha],2,["bc1-rgba-unorm-srgb"])),t.set("bc1-rgba-unorm-srgb",r("bc1-rgba-unorm-srgb",[o.Red,o.Green,o.Blue,o.Alpha],2,["bc1-rgba-unorm"])),t.set("bc2-rgba-unorm",r("bc2-rgba-unorm",[o.Red,o.Green,o.Blue,o.Alpha],4,["bc2-rgba-unorm-srgb"])),t.set("bc2-rgba-unorm-srgb",r("bc2-rgba-unorm-srgb",[o.Red,o.Green,o.Blue,o.Alpha],4,["bc2-rgba-unorm"])),t.set("bc3-rgba-unorm",r("bc3-rgba-unorm",[o.Red,o.Green,o.Blue,o.Alpha],4,["bc3-rgba-unorm-srgb"])),t.set("bc3-rgba-unorm-srgb",r("bc3-rgba-unorm-srgb",[o.Red,o.Green,o.Blue,o.Alpha],4,["bc3-rgba-unorm"])),t.set("bc4-r-unorm",r("bc4-r-unorm",[o.Red],8,[])),t.set("bc4-r-snorm",r("bc4-r-snorm",[o.Red],8,[])),t.set("bc5-rg-unorm",r("bc5-rg-unorm",[o.Red,o.Green],8,[])),t.set("bc5-rg-snorm",r("bc5-rg-snorm",[o.Red,o.Green],8,[])),t.set("bc6h-rgb-ufloat",r("bc6h-rgb-ufloat",[o.Red,o.Green,o.Blue],4,[])),t.set("bc6h-rgb-float",r("bc6h-rgb-float",[o.Red,o.Green,o.Blue],4,[])),t.set("bc7-rgba-unorm",r("bc7-rgba-unorm",[o.Red,o.Green,o.Blue,o.Alpha],4,["bc7-rgba-unorm-srgb"])),t.set("bc7-rgba-unorm-srgb",r("bc7-rgba-unorm-srgb",[o.Red,o.Green,o.Blue,o.Alpha],4,["bc7-rgba-unorm"]))}if(this.mDevice.capabilities.hasFeature(G.TextureCompressionEtc2)){let r=(a,n,s,l)=>({format:a,aspect:{types:n,byteCost:s},dimensions:["1d","2d"],type:[d.UnfilterableFloat,d.Float],compressionBlock:{width:4,height:4},usage:{textureBinding:!0,renderAttachment:!1,copy:{compatible:[a,...l],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}});t.set("etc2-rgb8unorm",r("etc2-rgb8unorm",[o.Red,o.Green,o.Blue],2,["etc2-rgb8unorm-srgb"])),t.set("etc2-rgb8unorm-srgb",r("etc2-rgb8unorm-srgb",[o.Red,o.Green,o.Blue],2,["etc2-rgb8unorm"])),t.set("etc2-rgb8a1unorm",r("etc2-rgb8a1unorm",[o.Red,o.Green,o.Blue,o.Alpha],2,["etc2-rgb8a1unorm-srgb"])),t.set("etc2-rgb8a1unorm-srgb",r("etc2-rgb8a1unorm-srgb",[o.Red,o.Green,o.Blue,o.Alpha],2,["etc2-rgb8a1unorm"])),t.set("etc2-rgba8unorm",r("etc2-rgba8unorm",[o.Red,o.Green,o.Blue,o.Alpha],4,["etc2-rgba8unorm-srgb"])),t.set("etc2-rgba8unorm-srgb",r("etc2-rgba8unorm-srgb",[o.Red,o.Green,o.Blue,o.Alpha],4,["etc2-rgba8unorm"])),t.set("eac-r11unorm",r("eac-r11unorm",[o.Red],8,[])),t.set("eac-r11snorm",r("eac-r11snorm",[o.Red],8,[])),t.set("eac-rg11unorm",r("eac-rg11unorm",[o.Red,o.Green],8,[])),t.set("eac-rg11snorm",r("eac-rg11snorm",[o.Red,o.Green],8,[]))}if(this.mDevice.capabilities.hasFeature(G.TextureCompressionAstc)){let r=(a,n,s)=>({format:a,aspect:{types:[o.Red,o.Green,o.Blue,o.Alpha],byteCost:4},dimensions:["1d","2d"],type:[d.UnfilterableFloat,d.Float],compressionBlock:{width:n[0],height:n[1]},usage:{textureBinding:!0,renderAttachment:!1,copy:{compatible:[a,...s],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}});t.set("astc-4x4-unorm",r("astc-4x4-unorm",[4,4],["astc-4x4-unorm-srgb"])),t.set("astc-4x4-unorm-srgb",r("astc-4x4-unorm-srgb",[4,4],["astc-4x4-unorm"])),t.set("astc-5x4-unorm",r("astc-5x4-unorm",[5,4],["astc-5x4-unorm-srgb"])),t.set("astc-5x4-unorm-srgb",r("astc-5x4-unorm-srgb",[5,4],["astc-5x4-unorm"])),t.set("astc-5x5-unorm",r("astc-5x5-unorm",[5,5],["astc-5x5-unorm-srgb"])),t.set("astc-5x5-unorm-srgb",r("astc-5x5-unorm-srgb",[5,5],["astc-5x5-unorm"])),t.set("astc-6x5-unorm",r("astc-6x5-unorm",[6,5],["astc-6x5-unorm-srgb"])),t.set("astc-6x5-unorm-srgb",r("astc-6x5-unorm-srgb",[6,5],["astc-6x5-unorm"])),t.set("astc-6x6-unorm",r("astc-6x6-unorm",[6,6],["astc-6x6-unorm-srgb"])),t.set("astc-6x6-unorm-srgb",r("astc-6x6-unorm-srgb",[6,6],["astc-6x6-unorm"])),t.set("astc-8x5-unorm",r("astc-8x5-unorm",[8,5],["astc-8x5-unorm-srgb"])),t.set("astc-8x5-unorm-srgb",r("astc-8x5-unorm-srgb",[8,5],["astc-8x5-unorm"])),t.set("astc-8x6-unorm",r("astc-8x6-unorm",[8,6],["astc-8x6-unorm-srgb"])),t.set("astc-8x6-unorm-srgb",r("astc-8x6-unorm-srgb",[8,6],["astc-8x6-unorm"])),t.set("astc-8x8-unorm",r("astc-8x8-unorm",[8,8],["astc-8x8-unorm-srgb"])),t.set("astc-8x8-unorm-srgb",r("astc-8x8-unorm-srgb",[8,8],["astc-8x8-unorm"])),t.set("astc-10x5-unorm",r("astc-10x5-unorm",[10,5],["astc-10x5-unorm-srgb"])),t.set("astc-10x5-unorm-srgb",r("astc-10x5-unorm-srgb",[10,5],["astc-10x5-unorm"])),t.set("astc-10x6-unorm",r("astc-10x6-unorm",[10,6],["astc-10x6-unorm-srgb"])),t.set("astc-10x6-unorm-srgb",r("astc-10x6-unorm-srgb",[10,6],["astc-10x6-unorm"])),t.set("astc-10x8-unorm",r("astc-10x8-unorm",[10,8],["astc-10x8-unorm-srgb"])),t.set("astc-10x8-unorm-srgb",r("astc-10x8-unorm-srgb",[10,8],["astc-10x8-unorm"])),t.set("astc-10x10-unorm",r("astc-10x10-unorm",[10,10],["astc-10x10-unorm-srgb"])),t.set("astc-10x10-unorm-srgb",r("astc-10x10-unorm-srgb",[10,10],["astc-10x10-unorm"])),t.set("astc-12x10-unorm",r("astc-12x10-unorm",[12,10],["astc-12x10-unorm-srgb"])),t.set("astc-12x10-unorm-srgb",r("astc-12x10-unorm-srgb",[12,10],["astc-12x10-unorm"])),t.set("astc-12x12-unorm",r("astc-12x12-unorm",[12,12],["astc-12x12-unorm-srgb"])),t.set("astc-12x12-unorm-srgb",r("astc-12x12-unorm-srgb",[12,12],["astc-12x12-unorm"]))}return t}};var It=class i{static async readDeviceLimits(t){let e=await globalThis.navigator.gpu.requestAdapter({powerPreference:t});if(!e)throw new m("Error requesting GPU adapter",i);let r={};for(let a of rt.valuesOf(C))r[a]=e.limits[a]??null;return r}static async request(t,e){let r=await globalThis.navigator.gpu.requestAdapter({powerPreference:t});if(!r)throw new m("Error requesting GPU adapter",i);let a=new Array,n={};if(e){if(e.features)for(let l of e.features){if(!r.features.has(l.name)){if(l.required)throw new m(`No Gpu found with the required feature "${l.name}"`,this);continue}a.push(l.name)}if(e.limits)for(let l of e.limits){let c=r.limits[l.name];if(typeof c>"u")throw new m(`Gpu does not support any "${l.name}" limit.`,this);let u=l.value;if(c<l.value){if(l.required)throw new m(`No Gpu found with the required limit "${l.name}" (has: ${c}, required: ${l.value})`,this);u=c}n[l.name]=u}}let s=await r.requestDevice({requiredFeatures:a,requiredLimits:n});if(!s)throw new m("Error requesting GPU device",i);return new i(s)}mCapabilities;mFrameChangeListener;mFreeableGpuObjectIndex;mFreeableGpuObjectResources;mFreeableGpuObjects;mGpuDevice;mTextureCapabilities;get capabilities(){return this.mCapabilities}get gpu(){return this.mGpuDevice}get textureCapabilities(){return this.mTextureCapabilities}constructor(t){this.mGpuDevice=t,this.mCapabilities=new Rt(t),this.mTextureCapabilities=new Bt(this),this.mFrameChangeListener=new q,this.mFreeableGpuObjects=new Array,this.mFreeableGpuObjectIndex=0,this.mFreeableGpuObjectResources=new Map}addTickListener(t){this.mFrameChangeListener.push(t)}deconstruct(){for(let t of this.mFreeableGpuObjects)if(this.mFreeableGpuObjectResources.has(t)){for(let e of this.mFreeableGpuObjectResources.get(t))e.destroy();this.mFreeableGpuObjectResources.delete(t)}this.mFreeableGpuObjects.splice(0,this.mFreeableGpuObjects.length),this.mGpuDevice.destroy()}execute(t){new Tt(this).execute(t)}processTick(){for(let e of this.mFrameChangeListener)e();let t=Math.min(10,this.mFreeableGpuObjects.length);for(let e=0;e<t;e++){let r=this.mFreeableGpuObjects[this.mFreeableGpuObjectIndex];if(!r.deref()){if(this.mFreeableGpuObjectResources.has(r)){for(let n of this.mFreeableGpuObjectResources.get(r))n.destroy();this.mFreeableGpuObjectResources.delete(r)}this.mFreeableGpuObjects.splice(this.mFreeableGpuObjectIndex,1)}++this.mFreeableGpuObjectIndex>=this.mFreeableGpuObjects.length&&(this.mFreeableGpuObjectIndex=0)}}registerFreeableResource(t,e){let r=new WeakRef(t);this.mFreeableGpuObjects.push(r),this.mFreeableGpuObjectResources.set(r,e)}removeTickListener(t){this.mFrameChangeListener.remove(t)}};var Q=class extends Y{mArrayLayerEnd;mArrayLayerStart;mDimension;mFormat;mMipLevelEnd;mMipLevelStart;mMultisampled;mTexture;get arrayLayerEnd(){return this.mArrayLayerEnd}set arrayLayerEnd(t){this.mArrayLayerEnd=t,this.invalidate(T.ResourceRebuild)}get arrayLayerStart(){return this.mArrayLayerStart}set arrayLayerStart(t){this.mArrayLayerStart=t,this.invalidate(T.ResourceRebuild)}get dimension(){return this.mDimension}get format(){return this.mFormat}get mipLevelEnd(){return this.mMipLevelEnd}set mipLevelEnd(t){this.mMipLevelEnd=t,this.invalidate(T.ResourceRebuild)}get mipLevelStart(){return this.mMipLevelStart}set mipLevelStart(t){this.mMipLevelStart=t,this.invalidate(T.ResourceRebuild)}get multisampled(){return this.mMultisampled}get native(){return super.native}get texture(){return this.mTexture}constructor(t,e,r,a,n){super(t),this.mTexture=e,this.mDimension=r,this.mFormat=a,this.mMultisampled=n,this.mMipLevelStart=0,this.mMipLevelEnd=-1,this.mArrayLayerStart=0,this.mArrayLayerEnd=-1,e.addInvalidationListener(()=>{this.invalidate(T.ResourceRebuild)},T.ResourceRebuild)}generateNative(){let t=this.mTexture.native,e=this.mMipLevelEnd<0?t.mipLevelCount-1:this.mMipLevelEnd,r=this.mArrayLayerEnd<0?t.depthOrArrayLayers-1:this.mArrayLayerEnd,a=(()=>{switch(this.mDimension){case"1d":case"2d":return 1;case"cube":return 6;case"cube-array":return Math.floor((r-this.mArrayLayerStart+1)/6)*6;case"2d-array":case"3d":return r-this.mArrayLayerStart+1;default:return 1}})();return t.createView({aspect:"all",format:this.mFormat,dimension:this.mDimension,baseMipLevel:this.mMipLevelStart,mipLevelCount:e-this.mMipLevelStart+1,baseArrayLayer:this.mArrayLayerStart,arrayLayerCount:a})}};var Pt=function(i){return i.Nearest="nearest",i.Linear="linear",i}({});var ue=function(i){return i.ClampToEdge="clamp-to-edge",i.Repeat="repeat",i.MirrorRepeat="mirror-repeat",i}({});var st=class extends Y{mCompare;mLodMaxClamp;mLodMinClamp;mMagFilter;mMaxAnisotropy;mMinFilter;mMipmapFilter;mSamplerType;mWrapMode;get compare(){return this.mCompare}set compare(t){this.mCompare=t,this.invalidate(T.ResourceRebuild)}get lodMaxClamp(){return this.mLodMaxClamp}set lodMaxClamp(t){this.mLodMaxClamp=t,this.invalidate(T.ResourceRebuild)}get lodMinClamp(){return this.mLodMinClamp}set lodMinClamp(t){this.mLodMinClamp=t,this.invalidate(T.ResourceRebuild)}get magFilter(){return this.mMagFilter}set magFilter(t){this.mMagFilter=t,this.invalidate(T.ResourceRebuild)}get maxAnisotropy(){return this.mMaxAnisotropy}set maxAnisotropy(t){this.mMaxAnisotropy=t,this.invalidate(T.ResourceRebuild)}get minFilter(){return this.mMinFilter}set minFilter(t){this.mMinFilter=t,this.invalidate(T.ResourceRebuild)}get mipmapFilter(){return this.mMipmapFilter}set mipmapFilter(t){this.mMipmapFilter=t,this.invalidate(T.ResourceRebuild)}get native(){return super.native}get samplerType(){return this.mSamplerType}get wrapMode(){return this.mWrapMode}set wrapMode(t){this.mWrapMode=t,this.invalidate(T.ResourceRebuild)}constructor(t,e){super(t),this.mSamplerType=e,this.mCompare=null,this.mWrapMode=ue.ClampToEdge,this.mMagFilter=Pt.Linear,this.mMinFilter=Pt.Linear,this.mMipmapFilter=Pt.Linear,this.mLodMinClamp=0,this.mLodMaxClamp=32,this.mMaxAnisotropy=16}generateNative(){let t={label:"Texture-Sampler",addressModeU:this.wrapMode,addressModeV:this.wrapMode,addressModeW:this.wrapMode,magFilter:this.magFilter,minFilter:this.minFilter,mipmapFilter:this.mipmapFilter,lodMaxClamp:this.lodMaxClamp,lodMinClamp:this.lodMinClamp,maxAnisotropy:this.maxAnisotropy};if(this.mSamplerType===nt.Comparison){if(!this.compare)throw new m("No compare function is set for a comparison sampler.",this);t.compare=this.compare}return this.device.gpu.createSampler(t)}};var X=class{mSetupCallback;mSetupReference;get device(){return this.mSetupReference.device}get setupData(){return this.mSetupReference.data}get setupReferences(){return this.mSetupReference}constructor(t,e){this.mSetupReference=t,this.mSetupCallback=e}ensureThatInSetup(){if(!this.mSetupReference.inSetup)throw new m("Can only setup in a setup call.",this)}sendData(...t){this.mSetupCallback(...t)}};var ot=class i extends Y{mDepth;mDimension;mFormat;mHeight;mMipLevelCount;mMultisampled;mWidth;get depth(){return this.mDepth}set depth(t){this.mDepth=t,this.invalidate(T.ResourceRebuild)}get dimension(){return this.mDimension}get format(){return this.mFormat}get height(){return this.mHeight}set height(t){this.mHeight=t,this.invalidate(T.ResourceRebuild)}get mipCount(){return this.mMipLevelCount}set mipCount(t){this.mMipLevelCount=t,this.invalidate(T.ResourceRebuild)}get multiSampled(){return this.mMultisampled}get native(){return super.native}get width(){return this.mWidth}set width(t){this.mWidth=t,this.invalidate(T.ResourceRebuild)}constructor(t,e){super(t),this.extendUsage(E.CopyDestination),this.extendUsage(E.CopySource),this.mDimension=e.dimension,this.mFormat=e.format,this.mMultisampled=e.multisampled,this.mMipLevelCount=1,this.mDepth=1,this.mHeight=1,this.mWidth=1}copyFrom(...t){let e=new Array;for(let n=0;n<t.length;n++){let s=t[n];if(!("data"in s)){switch(!0){case s instanceof i:{e.push({data:s,mipLevel:0,external:!1,dimension:{width:s.width,height:s.height,depthOrArrayLayers:s.depth},sourceOrigin:{x:0,y:0,z:0},targetOrigin:{x:0,y:0,z:n}});continue}case s instanceof ImageBitmap:{e.push({data:s,mipLevel:0,external:!0,dimension:{width:s.width,height:s.height,depthOrArrayLayers:1},sourceOrigin:{x:0,y:0,z:0},targetOrigin:{x:0,y:0,z:n}});continue}}continue}let l=!(s instanceof i);e.push({data:s.data,external:l,mipLevel:s.mipLevel??0,dimension:{width:s.dimension?.width??s.data.width,height:s.dimension?.height??s.data.height,depthOrArrayLayers:s.dimension?.depth??("depth"in s.data?s.data.depth:1)},sourceOrigin:s.sourceOrigin??{x:0,y:0,z:0},targetOrigin:s.targetOrigin??{x:0,y:0,z:0}})}this.extendUsage(E.CopyDestination),this.extendUsage(E.RenderAttachment);let r={texture:this.native,aspect:"all"},a=this.device.gpu.createCommandEncoder();for(let n of e){if(r.texture.mipLevelCount<n.mipLevel)continue;r.origin=n.targetOrigin,r.mipLevel=n.mipLevel;let s={width:Math.floor(r.texture.width/Math.pow(2,r.mipLevel)),height:Math.floor(r.texture.height/Math.pow(2,r.mipLevel)),depthOrArrayLayers:r.texture.dimension==="3d"?Math.floor(r.texture.depthOrArrayLayers/Math.pow(2,r.mipLevel)):r.texture.depthOrArrayLayers},l={width:Math.min(s.width-n.targetOrigin.x,n.dimension.width-n.sourceOrigin.x),height:Math.min(s.height-n.targetOrigin.y,n.dimension.height-n.sourceOrigin.y),depthOrArrayLayers:Math.min(s.depthOrArrayLayers-n.targetOrigin.z,n.dimension.depthOrArrayLayers-n.sourceOrigin.z)};if(l.width<1||l.height<1||l.depthOrArrayLayers<1)continue;if(n.external){let u={source:n.data,origin:[n.sourceOrigin.x,n.sourceOrigin.y]};this.device.gpu.queue.copyExternalImageToTexture(u,r,l);continue}let c={texture:n.data.native,aspect:"all",origin:n.targetOrigin,mipLevel:0};a.copyTextureToTexture(c,r,l)}this.device.gpu.queue.submit([a.finish()])}useAs(t){let e=t??this.mDimension;return new Q(this.device,this,e,this.mFormat,this.mMultisampled)}destroyNative(t){this.unregisterFreeableResource(t),t.destroy()}generateNative(t){let e=(()=>{switch(this.mDimension){case"1d":{let n=this.device.capabilities.getLimit(C.MaxTextureDimension1D);if(this.mWidth>n)throw new m(`Texture dimension exeeced for 1D Texture(${this.mWidth}).`,this);return{textureDimension:"1d",clampedDimensions:[this.mWidth,1,1]}}case"2d":{let n=this.device.capabilities.getLimit(C.MaxTextureDimension1D);if(this.mWidth>n||this.mHeight>n)throw new m(`Texture dimension exeeced for 2D Texture(${this.mWidth}, ${this.mHeight}).`,this);let s=this.device.capabilities.getLimit(C.MaxTextureArrayLayers);if(this.mDepth>s)throw new m(`Texture array layer exeeced for 2D Texture(${this.mDepth}).`,this);return{textureDimension:"2d",clampedDimensions:[this.mWidth,this.mHeight,this.mDepth]}}case"3d":{let n=this.device.capabilities.getLimit(C.MaxTextureDimension3D);if(this.mWidth>n||this.mHeight>n||this.mDepth>n)throw new m(`Texture dimension exeeced for 3D Texture(${this.mWidth}, ${this.mHeight}, ${this.mDepth}).`,this);return{textureDimension:"3d",clampedDimensions:[this.mWidth,this.mHeight,this.mDepth]}}}})(),r;e.textureDimension==="3d"?r=1+Math.floor(Math.log2(Math.max(this.mWidth,this.mHeight,this.mDepth))):r=1+Math.floor(Math.log2(Math.max(this.mWidth,this.mHeight)));let a=this.device.gpu.createTexture({label:"GPU-Texture",size:e.clampedDimensions,format:this.mFormat,usage:this.usage,dimension:e.textureDimension,sampleCount:this.mMultisampled?4:1,mipLevelCount:Math.min(this.mMipLevelCount,r)});if(this.registerFreeableResource(a),t!==null&&a.sampleCount===1){let n=this.device.gpu.createCommandEncoder(),s=Math.min(a.mipLevelCount,t.mipLevelCount);for(let l=0;l<s;l++){let c={texture:t,aspect:"all",origin:[0,0,0],mipLevel:l},u={texture:a,aspect:"all",origin:[0,0,0],mipLevel:l},h={width:Math.floor(a.width/Math.pow(2,l)),height:Math.floor(a.height/Math.pow(2,l)),depthOrArrayLayers:a.dimension==="3d"?Math.floor(a.depthOrArrayLayers/Math.pow(2,l)):a.depthOrArrayLayers},f={width:Math.floor(t.width/Math.pow(2,l)),height:Math.floor(t.height/Math.pow(2,l)),depthOrArrayLayers:t.dimension==="3d"?Math.floor(t.depthOrArrayLayers/Math.pow(2,l)):t.depthOrArrayLayers},x={width:Math.min(f.width,h.width),height:Math.min(f.height,h.height),depthOrArrayLayers:Math.min(f.depthOrArrayLayers,h.depthOrArrayLayers)};n.copyTextureToTexture(c,u,x)}this.device.gpu.queue.submit([n.finish()])}return a}};var Mt=class extends X{mBindLayout;mCurrentData;get hasData(){return this.mCurrentData!==null}constructor(t,e,r,a){super(r,a),this.mCurrentData=e,this.mBindLayout=t}createBuffer(t){let e=this.createEmptyBuffer(t??null);return this.sendData(e),e}createBufferWithRawData(t){if(this.mBindLayout.resource.type!=="buffer")throw new m("Bind data layout is not suitable for buffers.",this);let e=this.mBindLayout.resource,a=((()=>{if(e.variableSize===0)return 0;let l=(t.byteLength-e.fixedSize)/e.variableSize;if(l%1>0)throw new m(`Raw bind group data buffer data "${this.mBindLayout.name}" does not meet alignment.`,this);return l})()??0)*e.variableSize+e.fixedSize;if(this.mBindLayout.hasDynamicOffset){let s=this.mBindLayout.storageType===B.None?this.device.capabilities.getLimit(C.MinUniformBufferOffsetAlignment):this.device.capabilities.getLimit(C.MinStorageBufferOffsetAlignment);a=Math.ceil(a/s)*s,a*=Math.floor(t.byteLength/a)}if(t.byteLength!==a)throw new m(`Raw bind group data buffer data "${this.mBindLayout.name}" does not meet data size (Should:${a} => Has:${t.byteLength}) requirements.`,this);let n=new F(this.device,a).initialData(t);return this.sendData(n),n}createSampler(){if(this.mBindLayout.resource.type!=="sampler")throw new m("Bind data layout is not setup for samplers.",this);let t=new st(this.device,this.mBindLayout.resource.samplerType);return this.sendData(t),t}createTexture(){if(this.mBindLayout.resource.type!=="texture")throw new m("Bind data layout is not setup for textures.",this);let t=this.mBindLayout.resource,e=(()=>{switch(t.dimension){case"1d":return"1d";case"2d-array":case"cube":case"cube-array":case"2d":return"2d";case"3d":return"3d"}})(),a=new ot(this.device,{dimension:e,format:t.format,multisampled:t.multisampled}).useAs(t.dimension);return this.sendData(a),a}getRaw(){if(!this.mCurrentData)throw new m("No binding data was set.",this);return this.mCurrentData}set(t){return this.sendData(t),t}createEmptyBuffer(t=null){if(this.mBindLayout.resource.type!=="buffer")throw new m("Bind data layout is not setup for buffers.",this);let e=this.mBindLayout.resource,a=((()=>{if(e.variableSize>0&&t===null)throw new m(`For bind group data buffer "${this.mBindLayout.name}" a variable item count must be set.`,this);return t??0})()??0)*e.variableSize+e.fixedSize;if(this.mBindLayout.hasDynamicOffset){let s=this.mBindLayout.storageType===B.None?this.device.capabilities.getLimit(C.MinUniformBufferOffsetAlignment):this.device.capabilities.getLimit(C.MinStorageBufferOffsetAlignment);a=Math.ceil(a/s)*s,a*=t??1}return new F(this.device,a)}};var At=class extends D{mBindData;mDataInvalidationListener;mLayout;get layout(){return this.mLayout}get native(){return super.native}constructor(t,e){super(t),this.mLayout=e,this.mBindData=new v,this.mDataInvalidationListener=new WeakMap}data(t){let e=this.mLayout.getBind(t),r=this.mBindData.get(t)??null,a={device:this.device,inSetup:!0,data:null};return new Mt(e,r,a,n=>{switch(!0){case n instanceof F:{if(e.resource.type!=="buffer")throw new m(`Buffer added to bind data "${t}" but binding does not expect a buffer.`,this);e.storageType!==B.None?n.extendUsage(A.Storage):n.extendUsage(A.Uniform);break}case n instanceof st:{if(e.resource.type!=="sampler")throw new m(`Texture sampler added to bind data "${t}" but binding does not expect a texture sampler.`,this);break}case n instanceof Q:{if(e.resource.type!=="texture")throw new m(`Texture added to bind data "${t}" but binding does not expect a texture.`,this);e.storageType!==B.None?n.texture.extendUsage(E.Storage):n.texture.extendUsage(E.TextureBinding);break}default:throw new m(`Unsupported resource added to bind data "${t}".`,this)}let s=this.mBindData.get(t);if(s){let l=this.mDataInvalidationListener.get(s);l&&s.removeInvalidationListener(l)}this.mBindData.set(t,n),n.addInvalidationListener(()=>{this.invalidate(gt.NativeRebuild)},T.ResourceRebuild),this.invalidate(gt.NativeRebuild)})}generateNative(){this.invalidate(gt.NativeRebuild);let t=new Array;for(let e of this.layout.orderedBindingNames){let r=this.mBindData.get(e);if(!r)throw new m(`Data for binding "${e}" is not set.`,this);let a=this.layout.getBind(e),n={binding:a.index,resource:null};if(r instanceof F){n.resource={buffer:r.native},a.hasDynamicOffset&&(n.resource.size=a.resource.fixedSize),t.push(n);continue}if(r instanceof st){n.resource=r.native,t.push(n);continue}if(r instanceof Q){n.resource=r.native,t.push(n);continue}throw new m(`Bind type for "${r}" not supported`,this)}return this.device.gpu.createBindGroup({label:"Bind-Group",layout:this.layout.native,entries:t})}},gt=function(i){return i.NativeRebuild="NativeRebuild",i}({});var V=class{mSetupReference;get device(){return this.mSetupReference.device}get setupData(){return this.mSetupReference.data}get setupReferences(){return this.mSetupReference}constructor(t){this.mSetupReference=t,this.fillDefaultData(t.data)}ensureThatInSetup(){if(!this.mSetupReference.inSetup)throw new m("Can only setup in a setup call.",this)}};var Ot=class extends X{constructor(t,e){super(t,e)}asBuffer(t,e=0,r=!1){this.sendData({resource:{type:"buffer",fixedSize:t,variableSize:e},hasDynamicOffset:r})}asSampler(t){this.sendData({resource:{type:"sampler",samplerType:t},hasDynamicOffset:!1})}asTexture(t,e){this.sendData({resource:{type:"texture",dimension:t,format:e,multisampled:!1},hasDynamicOffset:!1})}};var Et=class extends V{binding(t,e,r,a){this.ensureThatInSetup();let n={name:e,index:t,visibility:r,resource:null,storageType:a??B.None,hasDynamicOffset:!1};return this.setupData.bindings.push(n),new Ot(this.setupReferences,s=>{n.resource=s.resource,n.hasDynamicOffset=s.hasDynamicOffset})}fillDefaultData(t){t.bindings=new Array}};var k=class extends D{mBindings;mHasDynamicOffset;mName;mOrderedBindingNames;mResourceCounter;get hasDynamicOffset(){return this.mHasDynamicOffset}get name(){return this.mName}get native(){return super.native}get orderedBindingNames(){return this.ensureSetup(),this.mOrderedBindingNames}get resourceCounter(){return this.mResourceCounter}constructor(t,e){super(t),this.mName=e,this.mHasDynamicOffset=!1,this.mResourceCounter={storageDynamicOffset:0,uniformDynamicOffset:0,sampler:0,sampledTextures:0,storageTextures:0,storageBuffers:0,uniformBuffers:0},this.mBindings=new v,this.mOrderedBindingNames=new Array}create(){return this.ensureSetup(),new At(this.device,this)}getBind(t){if(this.ensureSetup(),!this.mBindings.has(t))throw new m(`Bind ${t} does not exist.`,this);return this.mBindings.get(t)}hasBind(t){return this.ensureSetup(),this.mBindings.has(t)}generateNative(){let t=new Array;for(let e of this.mBindings.values()){let r={visibility:e.visibility,binding:e.index};switch(e.resource.type){case"buffer":{let a=(()=>{switch(e.storageType){case B.None:return"uniform";case B.Read:return"read-only-storage";default:return"storage"}})();r.buffer={type:a,minBindingSize:0,hasDynamicOffset:e.hasDynamicOffset};break}case"sampler":{r.sampler={type:e.resource.samplerType};break}case"texture":{if(e.storageType===B.None){let n=this.device.textureCapabilities.capabilityOf(e.resource.format);r.texture={sampleType:n.sampleTypes.values().next().value,multisampled:e.resource.multisampled,viewDimension:e.resource.dimension};break}let a;switch(e.storageType){case B.ReadWrite:{a="read-write";break}case B.Write:{a="write-only";break}case B.Read:{a="read-only";break}}r.storageTexture={access:a,format:e.resource.format,viewDimension:e.resource.dimension}}}t.push(r)}return this.device.gpu.createBindGroupLayout({label:`BindGroupLayout-${this.mName}`,entries:t})}onSetup(t){let e=this.device.capabilities.getLimit(C.MaxBindingsPerBindGroup);if(t.bindings.length>e-1)throw new m(`Bind group "${this.mName}" exceeds max binding count.`,this);let r=new Set,a=new Set;for(let n of t.bindings){if(!n.resource)throw new m(`Bind group binding "${n.name}" has no setup layout.`,this);if(n.hasDynamicOffset&&n.resource.type!=="buffer")throw new m(`Bind group binding "${n.name}" must be a buffer binding to have dynamic offsets.`,this);if(n.hasDynamicOffset&&n.resource.type==="buffer"&&n.resource.variableSize>0)throw new m(`Bind group binding "${n.name}" must have a fixed buffer layout to have dynamic offsets.`,this);if(this.mBindings.set(n.name,{name:n.name,index:n.index,resource:n.resource,visibility:n.visibility,storageType:n.storageType,hasDynamicOffset:n.hasDynamicOffset}),n.hasDynamicOffset&&(this.mHasDynamicOffset=!0,n.storageType===B.None?this.mResourceCounter.uniformDynamicOffset++:this.mResourceCounter.storageDynamicOffset++),r.has(n.index)||a.has(n.name))throw new m(`Binding "${n.name}" with index "${n.index}" added twice.`,this);switch(r.add(n.index),a.add(n.name),this.mOrderedBindingNames[n.index]=n.name,n.resource.type){case"sampler":{this.mResourceCounter.sampler++;break}case"texture":{n.storageType===B.None?this.mResourceCounter.sampledTextures++:this.mResourceCounter.storageTextures++;break}case"buffer":{n.storageType===B.None?this.mResourceCounter.uniformBuffers++:this.mResourceCounter.storageBuffers++;break}}}}onSetupObjectCreate(t){return new Et(t)}};var ht=class extends D{mLoadedPipeline;mParameter;mShaderModule;get layout(){return this.mShaderModule.shader.layout}get module(){return this.mShaderModule}get native(){return super.native}constructor(t,e){super(t),this.mShaderModule=e,this.mLoadedPipeline=null,this.mParameter=new v}setParameter(t,e){let r=this.mShaderModule.shader.parameter(t);for(let a of r)this.mParameter.has(a)||this.mParameter.set(a,{}),this.mParameter.get(a)[t]=e;return this.invalidate(se.NativeRebuild),this}generateNative(t,e){if(this.mLoadedPipeline!==null&&!e.has(se.NativeRebuild)){let a=this.mLoadedPipeline;return this.mLoadedPipeline=null,a}let r={layout:this.mShaderModule.shader.layout.native,compute:{module:this.mShaderModule.shader.native,entryPoint:this.mShaderModule.entryPoint,constants:this.mParameter.get(S.Compute)??{}}};return this.device.gpu.createComputePipelineAsync(r).then(a=>{this.mLoadedPipeline=a,this.invalidate(se.NativeLoaded)}),null}},se=function(i){return i.NativeRebuild="NativeRebuild",i.NativeLoaded="NativeLoaded",i}({});var Ft=class extends V{constructor(t){super(t)}addColor(t,e,r,a=!0,n){this.ensureThatInSetup(),this.setupData.colorTargets.push({name:t,index:e,format:r,keepOnEnd:a,clearValue:n??{r:0,g:0,b:0,a:0}})}addDepthStencil(t,e=null,r=null,a=null,n=null){this.ensureThatInSetup(),this.setupData.depthStencil={format:t},(e!==null||r!==null)&&(this.setupData.depthStencil.depth={keepOnEnd:e??!1,clearValue:r??0}),(a!==null||n!==null)&&(this.setupData.depthStencil.stencil={keepOnEnd:a??!1,clearValue:n??0})}fillDefaultData(t){t.colorTargets=new Array,t.depthStencil=null}};var Nt=class extends V{mLayout;constructor(t,e){super(t),this.mLayout=e}setOwnColorTarget(t,e){let r=this.mLayout.colorTarget(t);if(e.format!==r.format)throw new m(`Setup texture format for target "${t}" does not match layout format.`,this);this.setupData.colorTargets.set(t,e)}setOwnDepthStencilTarget(t){if(this.mLayout.multisampled&&!t.multiSampled)throw new m("Depth stencil target must be multisampled when layout is multisampled.",this);this.setupData.depthStencil=t}fillDefaultData(t){t.colorTargets=new Map,t.depthStencil=null}};var Gt=class i extends D{static DEPTH_STENCIL_KEY=Symbol("DepthStencil");mLayout;mSize;mTargetViewUpdateQueue;mTargets;get height(){return this.mSize.height}get layout(){return this.mLayout}get native(){return super.native}get width(){return this.mSize.width}constructor(t,e){super(t),this.mLayout=e,this.mSize={width:1,height:1},this.mTargetViewUpdateQueue=new Set,this.mTargets=new Map}colorTarget(t){if(this.ensureSetup(),!this.mTargets.has(t))throw new m(`Color target "${t}" does not exists.`,this);return this.mTargets.get(t).texture}depthStencilTarget(){if(this.ensureSetup(),!this.mTargets.has(i.DEPTH_STENCIL_KEY))throw new m("Depth or stencil target does not exists.",this);return this.mTargets.get(i.DEPTH_STENCIL_KEY).texture}resize(t,e){return this.ensureSetup(),this.mSize.width=e,this.mSize.height=t,this.applyResize(),this.invalidate(Ut.Resize),this}generateNative(){let t=new Array;for(let r of this.mLayout.colorTargetNames){let a=this.mLayout.colorTarget(r),n=this.mTargets.get(r),s=a.keepOnEnd?"store":"discard",l={view:n.texture.renderView.native,storeOp:s,loadOp:"clear",clearValue:a.clearValue};n.texture.resolveView&&(l.resolveTarget=n.texture.resolveView.native),a.clearValue!==null?l.loadOp="clear":l.loadOp="load",t.push(l)}let e={colorAttachments:t};if(this.mTargets.has(i.DEPTH_STENCIL_KEY)){let r=this.mTargets.get(i.DEPTH_STENCIL_KEY).texture.renderView,a=this.mLayout.depthStencilTarget();e.depthStencilAttachment={view:r.native},this.mLayout.hasDepth&&(e.depthStencilAttachment.depthClearValue=a.depth.clearValue,e.depthStencilAttachment.depthLoadOp="clear",e.depthStencilAttachment.depthStoreOp=a.depth.keepOnEnd?"store":"discard"),this.mLayout.hasStencil&&(e.depthStencilAttachment.stencilClearValue=a.stencil.clearValue,e.depthStencilAttachment.stencilLoadOp="clear",e.depthStencilAttachment.stencilStoreOp=a.stencil.keepOnEnd?"store":"discard")}return e}onSetup(t){let e=(r,a,n)=>{let l=(n||new ot(this.device,{format:a,dimension:"2d",multisampled:this.mLayout.multisampled})).useAs("2d");return l.texture.extendUsage(E.RenderAttachment),this.setTextureInvalidationListener(l,r),l};for(let r of this.mLayout.colorTargetNames){let a=this.mLayout.colorTarget(r),n=e(r,a.format,t.colorTargets.get(r)),s={primaryView:n};if(this.mLayout.multisampled&&!n.texture.multiSampled){let c=new ot(this.device,{format:a.format,dimension:"2d",multisampled:!0}).useAs("2d");c.texture.extendUsage(E.RenderAttachment),this.setTextureInvalidationListener(c,r),s.renderView=c,s.resolveView=n}else s.renderView=n,s.resolveView=null;this.mTargets.set(r,{name:r,index:a.index,texture:s})}if(this.mLayout.hasDepth||this.mLayout.hasStencil){let r=this.mLayout.depthStencilTarget(),a=e(i.DEPTH_STENCIL_KEY,r.format,t.depthStencil);this.mTargets.set(i.DEPTH_STENCIL_KEY,{name:i.DEPTH_STENCIL_KEY,index:-1,texture:{primaryView:a,renderView:a,resolveView:null}})}}onSetupObjectCreate(t){return new Nt(t,this.mLayout)}updateNative(t){for(let e of this.mTargetViewUpdateQueue){if(e===i.DEPTH_STENCIL_KEY){t.depthStencilAttachment.view=this.mTargets.get(i.DEPTH_STENCIL_KEY).texture.renderView.native;continue}let r=this.mTargets.get(e),a=t.colorAttachments[r.index];a.view=r.texture.renderView.native,r.texture.resolveView&&(a.resolveTarget=r.texture.resolveView.native)}return this.mTargetViewUpdateQueue.clear(),!0}applyResize(){for(let t of this.mTargets.values())t.texture.renderView.texture.height=this.mSize.height,t.texture.renderView.texture.width=this.mSize.width,t.texture.resolveView&&(t.texture.resolveView.texture.height=this.mSize.height,t.texture.resolveView.texture.width=this.mSize.width)}setTextureInvalidationListener(t,e){t.addInvalidationListener(()=>{this.invalidate(Ut.NativeUpdate),this.mTargetViewUpdateQueue.add(e)},T.ResourceRebuild)}},Ut=function(i){return i.NativeUpdate="NativeUpdate",i.Resize="Resize",i}({});var Vt=class extends D{mColorTargetFormats;mColorTargetOrder;mDepthStencilConfig;mMultisampled;get colorTargetNames(){return this.ensureSetup(),[...this.mColorTargetOrder]}get depthStencilFormat(){return this.ensureSetup(),this.mDepthStencilConfig?.format??null}get hasDepth(){return this.ensureSetup(),!!this.mDepthStencilConfig?.depth}get hasStencil(){return this.ensureSetup(),!!this.mDepthStencilConfig?.stencil}get multisampled(){return this.mMultisampled}constructor(t,e){super(t),this.mMultisampled=e,this.mColorTargetFormats=new v,this.mColorTargetOrder=new Array,this.mDepthStencilConfig=null}colorTarget(t){this.ensureSetup();let e=this.mColorTargetFormats.get(t);if(!e)throw new m(`Color target "${t}" does not exists.`,this);return e}create(t){return this.ensureSetup(),new Gt(this.device,this).setup(t)}depthStencilTarget(){if(this.ensureSetup(),!this.mDepthStencilConfig)throw new m("Depth or stencil target does not exists.",this);return this.mDepthStencilConfig}hasColorTarget(t){return this.mColorTargetFormats.has(t)}generateNative(){return null}onSetup(t){let e=this.device.capabilities.getLimit(C.MaxColorAttachments);if(t.colorTargets.length>e-1)throw new m("Max color targets count exeeced.",this);for(let r of t.colorTargets){if(this.mColorTargetFormats.has(r.name))throw new m(`Color attachment name "${r.name}" can only be defined once.`,this);if(this.mColorTargetOrder[r.index]!==void 0)throw new m(`Color attachment location index "${r.index}" can only be defined once.`,this);let a={index:r.index,format:r.format,keepOnEnd:r.keepOnEnd,clearValue:r.clearValue};this.mColorTargetFormats.set(r.name,a),this.mColorTargetOrder[r.index]=r.name}if(this.mColorTargetFormats.size!==this.mColorTargetOrder.length)throw new m("Color attachment locations must be in order.",this);t.depthStencil&&(this.mDepthStencilConfig={format:t.depthStencil.format},t.depthStencil.depth&&(this.mDepthStencilConfig.depth={keepOnEnd:t.depthStencil.depth.keepOnEnd,clearValue:t.depthStencil.depth.clearValue}),t.depthStencil.stencil&&(this.mDepthStencilConfig.stencil={keepOnEnd:t.depthStencil.stencil.keepOnEnd,clearValue:t.depthStencil.stencil.clearValue}))}onSetupObjectCreate(t){return new Ft(t)}};var kt=class extends X{withParameter(t,e,r,a,n=null){return this.sendData({name:t,location:e,format:r,multiplier:a,alignment:n}),this}};var _t=class extends V{buffer(t,e){let r={name:t,stepMode:e,parameter:new Array};return this.setupData.buffer.push(r),new kt(this.setupReferences,a=>{r.parameter.push(a)})}fillDefaultData(t){t.buffer=new Array}};var Wt=class extends D{mBuffer;mIndexBuffer;mIndexBufferFormat;mIndices;mLayout;get indexBuffer(){return this.mIndexBuffer}get indexBufferFormat(){return this.mIndexBufferFormat}get layout(){return this.mLayout}get vertexCount(){return this.mIndices.length}constructor(t,e,r){super(t),this.mLayout=e,this.mBuffer=new v,this.mIndices=r,this.mIndexBuffer=null,this.mIndexBufferFormat=Uint32Array,this.mLayout.indexable&&(r.length<Math.pow(2,16)?(this.mIndexBuffer=new F(t,r.length*2),this.mIndexBuffer.extendUsage(A.Index),this.mIndexBuffer.initialData(new Uint16Array(r).buffer),this.mIndexBufferFormat=Uint16Array):(this.mIndexBuffer=new F(t,r.length*4),this.mIndexBuffer.extendUsage(A.Index),this.mIndexBuffer.initialData(new Uint32Array(r).buffer),this.mIndexBufferFormat=Uint32Array))}create(t,e){let r=this.mLayout.parameterBuffer(t),a=new Array,n=0;for(let g of r.layout.properties)n+=g.item.count,a.push({count:g.item.count,format:g.item.format,itemByteCount:g.item.byteCount});if(e.length%n!==0)throw new m("Vertex parameter buffer data does not align with layout.",this);let s=e;if(!this.mLayout.indexable&&r.stepMode===O.Index){s=new Array;for(let g of this.mIndices){let p=g*n,b=p+n;s.push(...e.slice(p,b))}}let l=s.length/n;!this.mLayout.indexable&&r.stepMode===O.Index&&(l=this.mIndices.length);let c=new ArrayBuffer(r.layout.fixedSize*l),u=new DataView(c),h=(g,p,b)=>{switch(p){case y.Float32:{u.setFloat32(g,b,!0);break}case y.Uint32:{u.setUint32(g,b,!0);break}case y.Sint32:{u.setInt32(g,b,!0);break}case y.Uint8:{u.setUint8(g,b);break}case y.Sint8:{u.setInt8(g,b);break}case y.Uint16:{u.setUint16(g,b,!0);break}case y.Sint16:{u.setInt16(g,b,!0);break}case y.Float16:case y.Unorm16:case y.Snorm16:case y.Unorm8:case y.Snorm8:default:throw new m(`Currently "${p}" is not supported for vertex parameter.`,this)}},f=0,x=0;for(let g=0;g<l;g++)for(let p of a)for(let b=0;b<p.count;b++)h(x,p.format,s[f]),f++,x+=p.itemByteCount;let w=new F(this.device,c.byteLength).initialData(c);return w.extendUsage(A.Vertex),this.mBuffer.set(t,w),this.invalidate(ce.Data),w}get(t){if(!this.mBuffer.has(t))throw new m(`Vertex parameter buffer for "${t}" not set.`,this);return this.mBuffer.get(t)}set(t,e){let r=this.mLayout.parameterBuffer(t);if(e.size%r.layout.fixedSize!==0)throw new m("Set vertex parameter buffer does not align with layout.",this);let a=e.size/r.layout.fixedSize;if(!this.mLayout.indexable&&r.stepMode===O.Index&&(a=this.mIndices.length),e.size!==r.layout.fixedSize*a)throw new m(`Set vertex parameter buffer does not fit needed buffer size (Has:${e.size} => Should:${r.layout.fixedSize*a}).`,this);return e.extendUsage(A.Vertex),this.mBuffer.set(t,e),this.invalidate(ce.Data),e}},ce=function(i){return i.Data="DataChange",i}({});var J=class extends D{mBuffer;mIndexable;mParameter;get bufferNames(){return this.ensureSetup(),[...this.mBuffer.keys()]}get indexable(){return this.ensureSetup(),this.mIndexable}get native(){return super.native}get parameterNames(){return this.ensureSetup(),[...this.mParameter.keys()]}constructor(t){super(t),this.mIndexable=!1,this.mBuffer=new v,this.mParameter=new v}create(t){return new Wt(this.device,this,t)}parameter(t){let e=this.mParameter.get(t);if(!e)throw new m(`Vertex parameter "${t}" is not defined.`,this);return e}parameterBuffer(t){let e=this.mBuffer.get(t);if(!e)throw new m(`Vertex parameter buffer "${t}" is not defined.`,this);return e}generateNative(){let t=new Array;for(let e of this.mBuffer.values()){let r=new Array;for(let n of e.layout.properties){let s=`${n.item.format}x${n.item.count}`;n.item.count===1&&(s=n.item.format);let l=this.mParameter.get(n.name).location;r.push({format:s,offset:n.byteOffset,shaderLocation:l})}let a="vertex";e.stepMode===O.Instance&&(a="instance"),t.push({stepMode:a,arrayStride:e.layout.fixedSize,attributes:r})}return t}onSetup(t){let e=!0,r=new Set([L.Single,L.Vector2,L.Vector3,L.Vector4]),a=new Array;for(let n of t.buffer){let s=[],l=0;for(let c of n.parameter){if(a[c.location])throw new m(`Vertex parameter location "${c.location}" can't be defined twice.`,this);if(!r.has(c.multiplier))throw new m(`Vertex parameter item multiplier "${c.multiplier}" not supported.`,this);let u=this.computePrimitiveSize(c.format,c.multiplier);s.push({name:c.name,item:{format:c.format,count:this.itemCountOfMultiplier(c.multiplier),byteCount:this.itemFormatByteCount(c.format)},byteOffset:l,byteSize:u}),l+=u,this.mParameter.set(c.name,{name:c.name,location:c.location}),a[c.location]=!0}this.mBuffer.set(n.name,{name:n.name,stepMode:n.stepMode,layout:{fixedSize:l,properties:s}}),n.stepMode===O.Vertex&&(e=!1)}if(a.length!==this.mParameter.size)throw new m("Vertex parameter locations need to be in continious order.",this);this.mIndexable=e}onSetupObjectCreate(t){return new _t(t)}computePrimitiveSize(t,e){return this.itemFormatByteCount(t)*this.itemCountOfMultiplier(e)}itemCountOfMultiplier(t){switch(t){case L.Single:return 1;case L.Vector2:return 2;case L.Vector3:return 3;case L.Vector4:return 4;case L.Matrix22:return 4;case L.Matrix23:return 6;case L.Matrix24:return 8;case L.Matrix32:return 6;case L.Matrix33:return 9;case L.Matrix34:return 12;case L.Matrix42:return 8;case L.Matrix43:return 0;case L.Matrix44:return 16}}itemFormatByteCount(t){switch(t){case y.Float16:return 2;case y.Float32:return 4;case y.Uint32:return 4;case y.Sint32:return 4;case y.Uint8:return 1;case y.Sint8:return 1;case y.Uint16:return 2;case y.Sint16:return 2;case y.Unorm16:return 2;case y.Snorm16:return 2;case y.Unorm8:return 1;case y.Snorm8:return 1}}};var Yt=class extends X{withOffset(t,e){return this.sendData({bindingName:t,offsetIndex:e}),this}};var zt=class extends V{addGroup(t){let e={bindGroup:t,offsets:new v};return this.setupData.groups.push(e),new Yt(this.setupReferences,r=>{e.offsets.set(r.bindingName,r.offsetIndex)})}fillDefaultData(t){t.groups=new Array}};var jt=class extends D{mBindData;mInvalidationListener;mLayout;mOrderedBindData;get data(){return this.ensureSetup(),this.mOrderedBindData}get layout(){return this.mLayout}constructor(t,e){super(t),this.mLayout=e,this.mBindData=new v,this.mInvalidationListener=()=>{this.invalidate(Me.Data)},this.mOrderedBindData=new Array}deconstruct(){super.deconstruct();for(let t of this.mOrderedBindData)t.bindGroup.removeInvalidationListener(this.mInvalidationListener)}group(t){if(!this.mBindData.has(t))throw new m(`Bind group "${t}" does not exists in pipeline data.`,this);return this.mBindData.get(t)}onSetup(t){if(this.mLayout.groups.length!==t.groups.length){for(let e of this.mLayout.groups)if(!t.groups.find(a=>a.bindGroup.layout.name===e))throw new m(`Required bind group "${e}" not set.`,this)}for(let e of t.groups){let r=e.bindGroup.layout.name,a=this.mLayout.groupIndex(r),n=e.bindGroup;if(this.mOrderedBindData[a])throw new m(`Bind group "${r}" was added multiple times to render pass step.`,this);let s=this.mLayout.getGroupLayout(r);if(n.layout!==s)throw new m(`Source bind group layout for "${r}" does not match target layout.`,this);if(this.mBindData.has(r))throw new m(`Bind group "${r}" name already exists in pipeline data.`,this);let l={offsetId:"",bindGroup:n,offsets:new Array};if(s.hasDynamicOffset){for(let c of s.orderedBindingNames){let u=s.getBind(c);if(!u.hasDynamicOffset)continue;if(!e.offsets.has(c))throw new m(`Binding "${c}" of group "${r} requires a offset."`,this);let h=u.storageType===B.None?this.device.capabilities.getLimit(C.MinUniformBufferOffsetAlignment):this.device.capabilities.getLimit(C.MinStorageBufferOffsetAlignment),f=e.offsets.get(c),x=u.resource,w=Math.ceil(x.fixedSize/h)*h,g=n.data(c).getRaw().size;if(Math.floor(g/w)<=f)throw new m(`Binding "${c}" of group "${r} exceedes dynamic offset limits."`,this);l.offsets.push(w*f)}l.offsetId=l.offsets.join("-")}this.mBindData.set(r,l),this.mOrderedBindData[a]=l,n.addInvalidationListener(this.mInvalidationListener,gt.NativeRebuild)}}onSetupObjectCreate(t){return new zt(t)}},Me=function(i){return i.Data="DataChange",i}({});var Xt=class extends D{mBindGroupNames;mBindGroups;get groups(){return[...this.mBindGroupNames.keys()]}get native(){return super.native}constructor(t,e){super(t),this.mBindGroupNames=new v,this.mBindGroups=new v;let r={dynamicStorageBuffers:0,dynamicUniformBuffers:0,sampler:0,sampledTextures:0,storageTextures:0,uniformBuffers:0,storageBuffers:0},a=this.device.capabilities.getLimit(C.MaxBindGroups);for(let[n,s]of e){if(n>a-1)throw new m(`Bind group limit exceeded with index: ${n} and group "${s.name}"`,this);if(this.mBindGroupNames.has(s.name))throw new m(`Can add group name "${s.name}" only once.`,this);if(this.mBindGroups.has(n))throw new m(`Can add group location index "${n}" only once.`,this);this.mBindGroupNames.set(s.name,n),this.mBindGroups.set(n,s),r.dynamicStorageBuffers+=s.resourceCounter.storageDynamicOffset,r.dynamicUniformBuffers+=s.resourceCounter.uniformDynamicOffset,r.sampler+=s.resourceCounter.sampler,r.sampledTextures+=s.resourceCounter.sampledTextures,r.storageTextures+=s.resourceCounter.storageTextures,r.uniformBuffers+=s.resourceCounter.uniformBuffers,r.storageBuffers+=s.resourceCounter.storageBuffers}if(r.dynamicStorageBuffers>this.device.capabilities.getLimit(C.MaxDynamicStorageBuffersPerPipelineLayout))throw new m(`Max dynamic storage buffer reached pipeline. Max allowed "${this.device.capabilities.getLimit(C.MaxDynamicStorageBuffersPerPipelineLayout)}" has "${r.dynamicStorageBuffers}"`,this);if(r.dynamicUniformBuffers>this.device.capabilities.getLimit(C.MaxDynamicUniformBuffersPerPipelineLayout))throw new m(`Max dynamic uniform buffer reached pipeline. Max allowed "${this.device.capabilities.getLimit(C.MaxDynamicUniformBuffersPerPipelineLayout)}" has "${r.dynamicUniformBuffers}"`,this);if(r.sampler>this.device.capabilities.getLimit(C.MaxSamplersPerShaderStage))throw new m(`Max sampler reached pipeline. Max allowed "${this.device.capabilities.getLimit(C.MaxSamplersPerShaderStage)}" has "${r.sampler}"`,this);if(r.sampledTextures>this.device.capabilities.getLimit(C.MaxSampledTexturesPerShaderStage))throw new m(`Max sampled textures reached pipeline. Max allowed "${this.device.capabilities.getLimit(C.MaxSampledTexturesPerShaderStage)}" has "${r.sampledTextures}"`,this);if(r.storageTextures>this.device.capabilities.getLimit(C.MaxStorageTexturesPerShaderStage))throw new m(`Max storage textures reached pipeline. Max allowed "${this.device.capabilities.getLimit(C.MaxStorageTexturesPerShaderStage)}" has "${r.storageTextures}"`,this);if(r.storageBuffers>this.device.capabilities.getLimit(C.MaxStorageBuffersPerShaderStage))throw new m(`Max storage buffers reached pipeline. Max allowed "${this.device.capabilities.getLimit(C.MaxStorageBuffersPerShaderStage)}" has "${r.storageBuffers}"`,this);if(r.uniformBuffers>this.device.capabilities.getLimit(C.MaxUniformBuffersPerShaderStage))throw new m(`Max uniform buffers reached pipeline. Max allowed "${this.device.capabilities.getLimit(C.MaxUniformBuffersPerShaderStage)}" has "${r.uniformBuffers}"`,this)}getGroupLayout(t){let e=this.mBindGroupNames.get(t);if(typeof e>"u")throw new m(`Bind group layout (${t}) does not exists.`,this);return this.mBindGroups.get(e)}groupIndex(t){let e=this.mBindGroupNames.get(t);if(typeof e>"u")throw new m(`Pipeline does not contain a group with name "${t}".`,this);return e}withData(t){return new jt(this.device,this).setup(t)}generateNative(){let t={bindGroupLayouts:new Array};for(let[e,r]of this.mBindGroups)t.bindGroupLayouts[e]=r.native;if(this.mBindGroups.size!==t.bindGroupLayouts.length)throw new m("Bind group gap detected. Group not set.",this);return this.device.gpu.createPipelineLayout(t)}};var Ht=class extends V{computeEntryPoint(t,e,r=1,a=1){this.ensureThatInSetup();let n={name:t,workgroupDimension:{x:e,y:r,z:a}};this.setupData.computeEntrypoints.push(n)}fragmentEntryPoint(t,e){this.ensureThatInSetup();let r={name:t,renderTargets:e};return this.setupData.fragmentEntrypoints.push(r),e}group(t,e){return this.setupData.bindingGroups.push({index:t,group:e}),e}parameter(t,...e){return this.ensureThatInSetup(),this.setupData.parameter.push({name:t,usage:e}),this}vertexEntryPoint(t,e){this.ensureThatInSetup();let r={name:t,parameter:e};return this.setupData.vertexEntrypoints.push(r),e}fillDefaultData(t){t.computeEntrypoints=new Array,t.fragmentEntrypoints=new Array,t.vertexEntrypoints=new Array,t.parameter=new Array,t.bindingGroups=new Array}};var pt=class extends D{mEntryPoint;mShader;mSize;get entryPoint(){return this.mEntryPoint}get layout(){return this.mShader.layout}get shader(){return this.mShader}get workGroupSizeX(){return this.mSize[0]}get workGroupSizeY(){return this.mSize[1]}get workGroupSizeZ(){return this.mSize[2]}constructor(t,e,r,a){super(t),this.mEntryPoint=r,this.mShader=e,this.mSize=a??[-1,-1,-1]}create(){return new ht(this.device,this)}};var he=function(i){return i.CounterClockWise="cw",i.ClockWise="ccw",i}({});var lt=function(i){return i.PointList="point-list",i.LineList="line-list",i.LineStrip="line-strip",i.TriangleList="triangle-list",i.TriangleStrip="triangle-strip",i}({});var mt=function(i){return i.Keep="keep",i.Zero="zero",i.Replace="replace",i.Invert="invert",i.IncrementClamp="increment-clamp",i.DecrementClamp="decrement-clamp",i.IncrementWrap="increment-wrap",i.DecrementWrap="decrement-wrap",i}({});var $t=class{mCallback;mDataReference;constructor(t,e){this.mCallback=e,this.mDataReference=t}bias(t){return this.mDataReference.depthBias=t,this.mCallback(),this}biasClamp(t){return this.mDataReference.depthBiasClamp=t,this.mCallback(),this}biasSlopeScale(t){return this.mDataReference.depthBiasSlopeScale=t,this.mCallback(),this}compareWith(t){return this.mDataReference.depthCompare=t,this.mCallback(),this}enableWrite(t){return this.mDataReference.depthWriteEnabled=t,this.mCallback(),this}};var Zt=class{mCallback;mDataReference;constructor(t,e){this.mCallback=e,this.mDataReference=t}back(t,e,r,a){return this.mDataReference.stencilBack.compare=t,e&&(this.mDataReference.stencilBack.failOperation=e),r&&(this.mDataReference.stencilBack.passOperation=r),a&&(this.mDataReference.stencilBack.depthFailOperation=a),this.mCallback(),this}front(t,e,r,a){return this.mDataReference.stencilFront.compare=t,e&&(this.mDataReference.stencilFront.failOperation=e),r&&(this.mDataReference.stencilFront.passOperation=r),a&&(this.mDataReference.stencilFront.depthFailOperation=a),this.mCallback(),this}readMask(t){return this.mDataReference.stencilReadMask=t,this.mCallback(),this}writeMask(t){return this.mDataReference.stencilWriteMask=t,this.mCallback(),this}};var qt=class{mCallback;mDataReference;constructor(t,e){this.mCallback=e,this.mDataReference=t}alphaBlend(t,e,r){return this.mDataReference.alphaBlend={operation:t,sourceFactor:e,destinationFactor:r},this.mCallback(),this}colorBlend(t,e,r){return this.mDataReference.colorBlend={operation:t,sourceFactor:e,destinationFactor:r},this.mCallback(),this}writeMask(...t){return this.mDataReference.aspectWriteMask=new Set(t),this.mCallback(),this}};var Kt=class extends D{mDepthConfiguration;mLoadedPipeline;mParameter;mPrimitiveCullMode;mPrimitiveFrontFace;mPrimitiveTopology;mRenderTargetConfig;mRenderTargetsLayout;mShaderModule;mStencilConfiguration;get layout(){return this.mShaderModule.shader.layout}get module(){return this.mShaderModule}get native(){return super.native}get primitiveCullMode(){return this.mPrimitiveCullMode}set primitiveCullMode(t){this.mPrimitiveCullMode=t,this.invalidate(tt.NativeRebuild)}get primitiveFrontFace(){return this.mPrimitiveFrontFace}set primitiveFrontFace(t){this.mPrimitiveFrontFace=t,this.invalidate(tt.NativeRebuild)}get primitiveTopology(){return this.mPrimitiveTopology}set primitiveTopology(t){this.mPrimitiveTopology=t,this.invalidate(tt.NativeRebuild)}get renderTargets(){return this.mRenderTargetsLayout}constructor(t,e,r){super(t),this.mLoadedPipeline=null,this.mShaderModule=e,this.mRenderTargetsLayout=r,this.mRenderTargetConfig=new v,this.mParameter=new v,this.mDepthConfiguration={depthWriteEnabled:this.mRenderTargetsLayout.hasDepth,depthCompare:at.Less,depthBias:0,depthBiasSlopeScale:0,depthBiasClamp:0},this.mStencilConfiguration={stencilReadMask:0,stencilWriteMask:0,stencilBack:{compare:at.Allways,failOperation:mt.Keep,depthFailOperation:mt.Keep,passOperation:mt.Keep},stencilFront:{compare:at.Allways,failOperation:mt.Keep,depthFailOperation:mt.Keep,passOperation:mt.Keep}},this.mPrimitiveTopology=lt.TriangleList,this.mPrimitiveCullMode=K.Back,this.mPrimitiveFrontFace=he.ClockWise}depthConfig(){return new $t(this.mDepthConfiguration,()=>{this.invalidate(tt.NativeRebuild)})}setParameter(t,e){let r=this.mShaderModule.shader.parameter(t);for(let a of r)this.mParameter.has(a)||this.mParameter.set(a,{}),this.mParameter.get(a)[t]=e;return this.invalidate(tt.NativeRebuild),this}stencilConfig(){return new Zt(this.mStencilConfiguration,()=>{this.invalidate(tt.NativeRebuild)})}targetConfig(t){if(!this.mRenderTargetsLayout.hasColorTarget(t))throw new m(`Color target "${t}" does not exists.`,this);return this.mRenderTargetConfig.has(t)||this.mRenderTargetConfig.set(t,{colorBlend:{operation:it.Add,sourceFactor:U.One,destinationFactor:U.Zero},alphaBlend:{operation:it.Add,sourceFactor:U.One,destinationFactor:U.Zero},aspectWriteMask:new Set([o.Red,o.Green,o.Blue,o.Alpha])}),new qt(this.mRenderTargetConfig.get(t),()=>{this.invalidate(tt.NativeRebuild)})}generateNative(t,e){if(this.mLoadedPipeline!==null&&!e.has(tt.NativeRebuild)){let n=this.mLoadedPipeline;return this.mLoadedPipeline=null,n}let a={layout:this.mShaderModule.shader.layout.native,vertex:{module:this.mShaderModule.shader.native,entryPoint:this.mShaderModule.vertexEntryPoint,buffers:this.mShaderModule.vertexParameter.native,constants:this.mParameter.get(S.Vertex)??{}},primitive:this.generatePrimitive()};if(this.module.fragmentEntryPoint){let n=new Array;for(let s of this.mRenderTargetsLayout.colorTargetNames){let l=this.mRenderTargetsLayout.colorTarget(s);n.push({format:l.format,blend:this.generateRenderTargetBlendState(s),writeMask:this.generateRenderTargetWriteMask(s)})}a.fragment={module:this.mShaderModule.shader.native,entryPoint:this.module.fragmentEntryPoint,targets:n,constants:this.mParameter.get(S.Fragment)??{}}}if(this.mRenderTargetsLayout.hasDepth||this.mRenderTargetsLayout.hasStencil){if(a.depthStencil={format:this.mRenderTargetsLayout.depthStencilFormat},this.mRenderTargetsLayout.hasDepth&&(a.depthStencil.depthWriteEnabled=this.mDepthConfiguration.depthWriteEnabled,a.depthStencil.depthCompare=this.mDepthConfiguration.depthCompare,a.depthStencil.depthBias=this.mDepthConfiguration.depthBias,a.depthStencil.depthBiasSlopeScale=this.mDepthConfiguration.depthBiasSlopeScale,a.depthStencil.depthBiasClamp=this.mDepthConfiguration.depthBiasClamp,(this.mPrimitiveTopology===lt.LineList||this.mPrimitiveTopology===lt.LineStrip||this.mPrimitiveTopology===lt.PointList)&&(a.depthStencil.depthBias!==0||a.depthStencil.depthBiasSlopeScale!==0||a.depthStencil.depthBiasClamp!==0)))throw new m(`Pipelines depth bias settings must be zero for "${this.mPrimitiveTopology}"-Topology`,this);this.mRenderTargetsLayout.hasStencil&&(a.depthStencil.stencilReadMask=this.mStencilConfiguration.stencilReadMask,a.depthStencil.stencilWriteMask=this.mStencilConfiguration.stencilWriteMask,a.depthStencil.stencilBack={compare:this.mStencilConfiguration.stencilBack.compare,failOp:this.mStencilConfiguration.stencilBack.failOperation,depthFailOp:this.mStencilConfiguration.stencilBack.depthFailOperation,passOp:this.mStencilConfiguration.stencilBack.passOperation},a.depthStencil.stencilFront={compare:this.mStencilConfiguration.stencilFront.compare,failOp:this.mStencilConfiguration.stencilFront.failOperation,depthFailOp:this.mStencilConfiguration.stencilFront.depthFailOperation,passOp:this.mStencilConfiguration.stencilFront.passOperation})}return this.mRenderTargetsLayout.multisampled&&(a.multisample={count:4}),this.device.gpu.createRenderPipelineAsync(a).then(n=>{this.mLoadedPipeline=n,this.invalidate(tt.NativeLoaded)}),null}generatePrimitive(){let t;switch(this.primitiveTopology){case lt.LineStrip:case lt.TriangleStrip:{t="uint32";break}}let e={topology:this.primitiveTopology,frontFace:this.primitiveFrontFace,cullMode:this.primitiveCullMode,unclippedDepth:!1};return t&&(e.stripIndexFormat=t),e}generateRenderTargetBlendState(t){let e=this.mRenderTargetConfig.get(t),r={color:{operation:"add",srcFactor:"one",dstFactor:"zero"},alpha:{operation:"add",srcFactor:"one",dstFactor:"zero"}};return e&&(r.alpha={operation:e.alphaBlend.operation,srcFactor:e.alphaBlend.sourceFactor,dstFactor:e.alphaBlend.destinationFactor},r.color={operation:e.colorBlend.operation,srcFactor:e.colorBlend.sourceFactor,dstFactor:e.colorBlend.destinationFactor}),r}generateRenderTargetWriteMask(t){let e=this.mRenderTargetConfig.get(t),r=15;return e&&(r=0,e.aspectWriteMask.has(o.Red)&&(r+=1),e.aspectWriteMask.has(o.Green)&&(r+=2),e.aspectWriteMask.has(o.Red)&&(r+=4),e.aspectWriteMask.has(o.Alpha)&&(r+=8)),r}},tt=function(i){return i.NativeRebuild="NativeRebuild",i.NativeLoaded="NativeLoaded",i}({});var Qt=class extends D{mFragmentEntryPoint;mFragmentRenderTargetsLayout;mShader;mVertexEntryPoint;mVertexParameter;get fragmentEntryPoint(){return this.mFragmentEntryPoint}get layout(){return this.mShader.layout}get shader(){return this.mShader}get vertexEntryPoint(){return this.mVertexEntryPoint}get vertexParameter(){return this.mVertexParameter}constructor(t,e,r,a,n,s){super(t),this.mVertexEntryPoint=r,this.mVertexParameter=a,this.mFragmentEntryPoint=n,this.mFragmentRenderTargetsLayout=s,this.mShader=e}create(){return new Kt(this.device,this,this.mFragmentRenderTargetsLayout)}};var H=class extends D{mEntryPoints;mParameter;mPipelineLayout;mSource;mSourceMap;get computeEntryPoints(){return this.ensureSetup(),[...this.mEntryPoints.compute.keys()]}get fragmentEntryPoints(){return this.ensureSetup(),[...this.mEntryPoints.fragment.keys()]}get layout(){return this.ensureSetup(),this.mPipelineLayout}get native(){return super.native}get vertexEntryPoints(){return this.ensureSetup(),[...this.mEntryPoints.vertex.keys()]}constructor(t,e,r=null){super(t),this.mSource=e,this.mSourceMap=r,this.mParameter=new v,this.mPipelineLayout=null,this.mEntryPoints={compute:new v,vertex:new v,fragment:new v}}createComputeModule(t){this.ensureSetup();let e=this.mEntryPoints.compute.get(t);if(!e)throw new m(`Compute entry point "${t}" does not exists.`,this);return e.static?new pt(this.device,this,t,[e.workgroupDimension.x??1,e.workgroupDimension.y??1,e.workgroupDimension.z??1]):new pt(this.device,this,t)}createRenderModule(t,e){this.ensureSetup();let r=this.mEntryPoints.vertex.get(t);if(!r)throw new m(`Vertex entry point "${t}" does not exists.`,this);let a=this.mEntryPoints.fragment.get(e);if(!a)throw new m(`Fragment entry point "${e}" does not exists.`,this);return new Qt(this.device,this,t,r.parameter,e,a.renderTargets)}parameter(t){this.ensureSetup();let e=this.mParameter.get(t);if(!e)throw new m(`Shader has parameter "${t}" not defined.`,this);return new Set(e)}generateNative(){let t=this.mPipelineLayout.native,e=new Array;for(let r of[...this.mEntryPoints.vertex.keys(),...this.mEntryPoints.fragment.keys(),...this.mEntryPoints.compute.keys()])e.push({entryPoint:r,layout:t});return this.device.gpu.createShaderModule({code:this.mSource,compilationHints:e})}onSetup(t){for(let r of t.parameter){if(this.mParameter.has(r.name))throw new m(`Can't add parameter "${r.name}" more than once.`,this);this.mParameter.set(r.name,new Set(r.usage))}for(let r of t.fragmentEntrypoints){if(this.mEntryPoints.fragment.has(r.name))throw new m(`Fragment entry "${r.name}" was setup more than once.`,this);this.mEntryPoints.fragment.set(r.name,{renderTargets:r.renderTargets})}for(let r of t.vertexEntrypoints){if(this.mEntryPoints.vertex.has(r.name))throw new m(`Vertex entry "${r.name}" was setup more than once.`,this);this.mEntryPoints.vertex.set(r.name,{parameter:r.parameter})}for(let r of t.computeEntrypoints){if(this.mEntryPoints.compute.has(r.name))throw new m(`Vertex entry "${r.name}" was setup more than once.`,this);this.mEntryPoints.compute.set(r.name,{static:r.workgroupDimension!==null,workgroupDimension:{x:r.workgroupDimension?.x??null,y:r.workgroupDimension?.y??null,z:r.workgroupDimension?.z??null}})}let e=new v;for(let r of t.bindingGroups)e.set(r.index,r.group);this.mPipelineLayout=new Xt(this.device,e)}onSetupObjectCreate(t){return new Ht(t)}};var Jt=class extends Y{mCanvas;mContext;mFrameListener;get canvas(){return this.mCanvas}get depth(){return 1}get dimension(){return"2d"}get format(){return this.device.textureCapabilities.preferredCanvasFormat}get height(){return this.mCanvas.height}set height(t){this.mCanvas.height=t}get mipCount(){return 1}get multiSampled(){return!1}get native(){return super.native}get width(){return this.mCanvas.width}set width(t){this.mCanvas.width=t}constructor(t,e){super(t),this.mCanvas=e,this.mContext=null,this.height=Math.max(e.height,1),this.width=Math.max(e.width,1),this.mFrameListener=()=>{this.invalidate(T.ResourceRebuild)},this.device.addTickListener(this.mFrameListener)}useAs(t){let e=t??this.dimension;return new Q(this.device,this,e,this.format,this.multiSampled)}destroyNative(t,e){t.destroy(),this.unregisterFreeableResource(t),e.deconstruct&&(this.device.removeTickListener(this.mFrameListener),this.mContext.unconfigure(),this.mContext=null)}generateNative(){this.mContext||(this.mContext=this.canvas.getContext("webgpu"),this.mContext.configure({device:this.device.gpu,format:this.device.textureCapabilities.preferredCanvasFormat,usage:E.CopyDestination|E.RenderAttachment,alphaMode:"opaque"}));let t=this.mContext.getCurrentTexture();return t.label="Canvas-Texture",this.registerFreeableResource(t),t}};var z=class i{mData;get data(){return this.mData}get w(){return this.mData[3]}get x(){return this.mData[0]}get y(){return this.mData[1]}get z(){return this.mData[2]}constructor(t){this.mData=[...t]}add(t){let e=new Array;if(t instanceof i){if(this.mData.length!==t.data.length)throw new m("Vectors need to be the same length for calculation.",this);for(let r=0;r<this.mData.length;r++)e.push(this.mData[r]+t.data[r])}else for(let r of this.mData)e.push(r+t);return new i(e)}length(){return Math.hypot(...this.mData)}multCross(t){if(this.mData.length!==t.data.length&&this.mData.length!==3)throw new m("Vectors need to be the length of 3 for corss product calculation.",this);return new i([this.mData[1]*t.data[2]-this.mData[2]*t.data[1],this.mData[2]*t.data[0]-this.mData[0]*t.data[2],this.mData[0]*t.data[1]-this.mData[1]*t.data[0]])}multDot(t){if(this.mData.length!==t.data.length)throw new m("Vectors need to be the same length for calculation.",this);let e=0;for(let r=0;r<this.mData.length;r++)e+=this.mData[r]*t.data[r];return e}normalize(){let t=this.length(),e=new Array;for(let r of this.mData)e.push(r/t);return new i(e)}sub(t){let e=new Array;if(t instanceof i){if(this.mData.length!==t.data.length)throw new m("Vectors need to be the same length for calculation.",this);for(let r=0;r<this.mData.length;r++)e.push(this.mData[r]-t.data[r])}else for(let r of this.mData)e.push(r-t);return new i(e)}};var te=class{mColor;get data(){return this.mColor.data}constructor(){this.mColor=new z([1,1,1,1])}setColor(t,e,r){if(t>1||t<0||e>1||e<0||r>1||r<0)throw new m(`Color values need to be in 0 to 1 range. (R:${t}, G:${e}, B:${r})`,this);this.mColor.data[0]=t,this.mColor.data[1]=e,this.mColor.data[2]=r}};var $=class i{static fromArray(t,e,r){let a=new Array;for(let n=0;n<e;n++){let s=new Array(r);for(let l=0;l<r;l++)s[l]=t[l*e+n];a.push(s)}return new i(a)}static identity(t){let e=new Array;for(let r=0;r<t;r++){let a=new Array(t).fill(0);a[r]=1,e.push(a)}return new i(e)}mData;get data(){return this.mData}get dataArray(){let t=new Array;for(let e=0;e<this.width;e++)for(let r=0;r<this.height;r++)t.push(this.mData[r][e]);return t}get height(){return this.mData.length}get width(){return this.mData[0]?.length??0}constructor(t){this.mData=t}add(t){let e=new Array;if(t instanceof i){if(this.height!==t.height&&this.width!==t.width)throw new m("Matrices need to be the same size for calculation.",this);for(let r=0;r<this.height;r++){let a=new Array(this.width);for(let n=0;n<a.length;n++)a[n]=this.mData[r][n]+t.data[r][n];e.push(a)}}else for(let r=0;r<this.height;r++){let a=new Array(this.width);for(let n=0;n<a.length;n++)a[n]=this.mData[r][n]+t;e.push(a)}return new i(e)}adjoint(){let t=new Array;for(let r=0;r<this.height;r++){let a=new Array;for(let n=0;n<this.width;n++){let s=this.omit(r,n).determinant();s*=Math.pow(-1,r+1+(n+1)),a.push(s)}t.push(a)}return new i(t).transpose()}determinant(){if(this.height===1&&this.width===1)return this.data[0][0];let t=0;for(let e=0;e<this.width;e++){let r=this.data[0][e];if(r*=e%2?-1:1,r!==0){let a=this.omit(0,e);t+=r*a.determinant()}}return t}inverse(){let t=this.adjoint(),e=this.determinant();for(let r=0;r<this.width;r++)for(let a=0;a<this.height;a++)t.data[a][r]/=e;return t}mult(t){let e=new Array;if(t instanceof i){if(this.width!==t.height)throw new m("Matrices A width and B height must match for multiplication.",this);for(let r=0;r<this.height;r++){let a=new Array(t.width);for(let n=0;n<a.length;n++){let s=0;for(let l=0;l<this.height;l++)s+=this.mData[r][l]*t.data[l][n];a[n]=s}e.push(a)}}else for(let r=0;r<this.height;r++){let a=new Array(this.width);for(let n=0;n<this.width;n++)a[n]=this.mData[r][n]*t;e.push(a)}return new i(e)}omit(t,e){let r=new Array;for(let a=0;a<this.height;a++)if(a!==t){let n=new Array;for(let s=0;s<this.width;s++)s!==e&&n.push(this.data[a][s]);r.push(n)}return new i(r)}sub(t){let e=new Array;if(t instanceof i){if(this.height!==t.height&&this.width!==t.width)throw new m("Matrices need to be the same size for calculation.",this);for(let r=0;r<this.height;r++){let a=new Array(this.width);for(let n=0;n<a.length;n++)a[n]=this.mData[r][n]-t.data[r][n];e.push(a)}}else for(let r=0;r<this.height;r++){let a=new Array(this.width);for(let n=0;n<a.length;n++)a[n]=this.mData[r][n]-t;e.push(a)}return new i(e)}transpose(){let t=new Array;for(let e=0;e<this.width;e++){let r=new Array;for(let a=0;a<this.height;a++)r.push(this.data[a][e]);t.push(r)}return new i(t)}vectorMult(t){if(this.width!==t.data.length)throw new m("Matrices A width and B height must match for multiplication.",this);let e=new Array;for(let n of t.data)e.push([n]);let r=this.mult(new i(e)),a=new Array;for(let n=0;n<r.height;n++)a.push(r.data[n][0]);return new z(a)}};var ee=class{mX;mY;mZ;get x(){return this.mX}set x(t){this.mX=t}get y(){return this.mY}set y(t){this.mY=t}get z(){return this.mZ}set z(t){this.mZ=t}constructor(){this.mX=0,this.mY=0,this.mZ=0}};var dt=class i{static fromRotation(t,e,r){let a=t%360*Math.PI/180,n=e%360*Math.PI/180,s=r%360*Math.PI/180,l=Math.cos(a*.5),c=Math.sin(a*.5),u=Math.cos(n*.5),h=Math.sin(n*.5),f=Math.cos(s*.5),x=Math.sin(s*.5),w=i.identity();return w.w=l*u*f+c*h*x,w.x=c*u*f-l*h*x,w.y=l*h*f+c*u*x,w.z=l*u*x-c*h*f,w}static identity(){return new i(1,0,0,0)}mW;mX;mY;mZ;get vectorForward(){let t=2*Math.pow(this.mX,2),e=2*Math.pow(this.mY,2),r=2*this.mX*this.mZ,a=2*this.mY*this.mW,n=2*this.mY*this.mZ,s=2*this.mX*this.mW,l=r+a,c=n-s,u=1-t-e;return new z([l,c,u])}get vectorRight(){let t=2*Math.pow(this.mY,2),e=2*Math.pow(this.mZ,2),r=2*this.mX*this.mY,a=2*this.mZ*this.mW,n=2*this.mY*this.mZ,s=2*this.mX*this.mW,l=1-t-e,c=r+a,u=n+s;return new z([l,c,u])}get vectorUp(){let t=2*Math.pow(this.mX,2),e=2*Math.pow(this.mZ,2),r=2*this.mX*this.mY,a=2*this.mZ*this.mW,n=2*this.mY*this.mZ,s=2*this.mX*this.mW,l=r-a,c=1-t-e,u=n+s;return new z([l,c,u])}get w(){return this.mW}set w(t){this.mW=t}get x(){return this.mX}set x(t){this.mX=t}get y(){return this.mY}set y(t){this.mY=t}get z(){return this.mZ}set z(t){this.mZ=t}constructor(t,e,r,a){this.mX=e,this.mY=r,this.mZ=a,this.mW=t}addEulerRotation(t,e,r){return this.mult(i.fromRotation(t,e,r))}asEuler(){let t=new ee,e=2*(this.mW*this.mX+this.mY*this.mZ),r=1-2*(this.mX*this.mX+this.mY*this.mY),n=Math.atan2(e,r)*180/Math.PI%360;t.x=n<0?n+360:n;let s=Math.sqrt(1+2*(this.mW*this.mY-this.mX*this.mZ)),l=Math.sqrt(1-2*(this.mW*this.mY-this.mX*this.mZ)),u=(2*Math.atan2(s,l)-Math.PI/2)*180/Math.PI%360;t.y=u<0?u+360:u;let h=2*(this.mW*this.mZ+this.mX*this.mY),f=1-2*(this.mY*this.mY+this.mZ*this.mZ),w=Math.atan2(h,f)*180/Math.PI%360;return t.z=w<0?w+360:w,t}asMatrix(){let t=2*Math.pow(this.mX,2),e=2*Math.pow(this.mY,2),r=2*Math.pow(this.mZ,2),a=2*this.mX*this.mY,n=2*this.mZ*this.mW,s=2*this.mX*this.mZ,l=2*this.mY*this.mW,c=2*this.mY*this.mZ,u=2*this.mX*this.mW,h=$.identity(4);return h.data[0][0]=1-e-r,h.data[0][1]=a-n,h.data[0][2]=s+l,h.data[1][0]=a+n,h.data[1][1]=1-t-r,h.data[1][2]=c-u,h.data[2][0]=s-l,h.data[2][1]=c+u,h.data[2][2]=1-t-e,h}mult(t){let e=this.mW*t.w-this.mX*t.x-this.mY*t.y-this.mZ*t.z,r=this.mW*t.x+this.mX*t.w+this.mY*t.z-this.mZ*t.y,a=this.mW*t.y-this.mX*t.z+this.mY*t.w+this.mZ*t.x,n=this.mW*t.z+this.mX*t.y-this.mY*t.x+this.mZ*t.w;return new i(e,r,a,n)}normalize(){let t=Math.hypot(Math.pow(this.mW,2),Math.pow(this.mX,2),Math.pow(this.mY,2),Math.pow(this.mZ,2));return new i(this.mW/t,this.mX/t,this.mY/t,this.mZ/t)}};var j=class{mPivot;mRotation;mScale;mTranslation;get pivotX(){return this.mPivot.data[0][3]}set pivotX(t){this.mPivot.data[0][3]=t}get pivotY(){return this.mPivot.data[1][3]}set pivotY(t){this.mPivot.data[1][3]=t}get pivotZ(){return this.mPivot.data[2][3]}set pivotZ(t){this.mPivot.data[2][3]=t}get rotationPitch(){return this.mRotation.asEuler().x}get rotationRoll(){return this.mRotation.asEuler().z}get rotationYaw(){return this.mRotation.asEuler().y}get scaleDepth(){return this.mScale.data[2][2]}get scaleHeight(){return this.mScale.data[1][1]}get scaleWidth(){return this.mScale.data[0][0]}get translationX(){return this.mTranslation.data[0][3]}get translationY(){return this.mTranslation.data[1][3]}get translationZ(){return this.mTranslation.data[2][3]}constructor(){this.mScale=$.identity(4),this.mTranslation=$.identity(4),this.mRotation=new dt(1,0,0,0),this.mPivot=$.identity(4)}addEulerRotation(t,e,r){this.mRotation=this.mRotation.addEulerRotation(t,e,r)}addRotation(t,e,r){this.mRotation=dt.fromRotation(t,e,r).mult(this.mRotation)}addScale(t,e,r){this.mScale.data[0][0]+=t,this.mScale.data[1][1]+=e,this.mScale.data[2][2]+=r}addTranslation(t,e,r){return this.mTranslation.data[0][3]+=t,this.mTranslation.data[1][3]+=e,this.mTranslation.data[2][3]+=r,this}getMatrix(t){switch(t){case M.Scale:return this.mScale;case M.Translation:return this.mTranslation;case M.Rotation:return this.mRotation.asMatrix();case M.PivotRotation:{let e=this.getMatrix(M.Rotation),r;return this.pivotX!==0||this.pivotY!==0||this.pivotZ!==0?r=this.mPivot.inverse().mult(e).mult(this.mPivot):r=e,r}case M.Transformation:{let e=this.getMatrix(M.Scale),r=this.getMatrix(M.Translation),a=this.getMatrix(M.PivotRotation);return r.mult(a).mult(e)}}}setRotation(t,e,r){let a=t??this.rotationPitch,n=e??this.rotationYaw,s=r??this.rotationRoll;this.mRotation=dt.fromRotation(a,n,s)}setScale(t,e,r){return this.mScale.data[0][0]=t??this.scaleWidth,this.mScale.data[1][1]=e??this.scaleHeight,this.mScale.data[2][2]=r??this.scaleDepth,this}setTranslation(t,e,r){return this.mTranslation.data[0][3]=t??this.translationX,this.mTranslation.data[1][3]=e??this.translationY,this.mTranslation.data[2][3]=r??this.translationZ,this}translateInDirection(t,e,r){let a=new z([e,r,t,1]),n=this.getMatrix(M.Rotation).vectorMult(a);this.addTranslation(n.x,n.y,n.z)}},M=function(i){return i[i.Rotation=1]="Rotation",i[i.PivotRotation=2]="PivotRotation",i[i.Translation=3]="Translation",i[i.Scale=4]="Scale",i[i.Transformation=5]="Transformation",i}({});var re=class{mAngleOfView;mAspectRatio;mCacheProjectionMatrix;mFar;mNear;get angleOfView(){return this.mAngleOfView}set angleOfView(t){this.mAngleOfView=t,this.mCacheProjectionMatrix=null}get aspectRatio(){return this.mAspectRatio}set aspectRatio(t){this.mAspectRatio=t,this.mCacheProjectionMatrix=null}get far(){return this.mFar}set far(t){this.mFar=t,this.mCacheProjectionMatrix=null}get near(){return this.mNear}set near(t){this.mNear=t,this.mCacheProjectionMatrix=null}get projectionMatrix(){return this.mCacheProjectionMatrix===null&&(this.mCacheProjectionMatrix=this.createMatrix()),this.mCacheProjectionMatrix}constructor(){this.mAngleOfView=0,this.mNear=0,this.mFar=0,this.mAspectRatio=0,this.mCacheProjectionMatrix=null}createMatrix(){let t=$.identity(4);t.data[0][0]=0,t.data[1][1]=0,t.data[2][2]=0,t.data[3][3]=0;let e=this.mFar,r=this.mNear,a=this.mNear*Math.tan(this.angleOfView*Math.PI/180/2),n=-a,s=a*this.aspectRatio,l=-s;return t.data[0][0]=2*r/(s-l),t.data[0][2]=-(s+l)/(s-l),t.data[1][1]=2*r/(a-n),t.data[1][2]=-(a+n)/(a-n),t.data[2][2]=e/(e-r),t.data[2][3]=-(e*r)/(e-r),t.data[3][2]=1,t}};var ie=class{mProjection;mTransformation;get projection(){return this.mProjection}get transformation(){return this.mTransformation}constructor(t){this.mProjection=t,this.mTransformation=new j}getMatrix(t){switch(t){case N.Translation:return this.mTransformation.getMatrix(M.Translation);case N.Rotation:return this.mTransformation.getMatrix(M.Rotation);case N.PivotRotation:return this.mTransformation.getMatrix(M.PivotRotation);case N.Projection:return this.mProjection.projectionMatrix;case N.View:{let e=this.getMatrix(N.Translation),r=this.getMatrix(N.Rotation);return e.mult(r).inverse()}case N.ViewProjection:{let e=this.getMatrix(N.View);return this.getMatrix(N.Projection).mult(e)}}}},N=function(i){return i[i.Translation=1]="Translation",i[i.Rotation=2]="Rotation",i[i.PivotRotation=3]="PivotRotation",i[i.Projection=4]="Projection",i[i.View=5]="View",i[i.ViewProjection=6]="ViewProjection",i}({});var de=`// ------------------------- Object Values ---------------------- //\r
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
}`;var fe=`// ------------------------- Object Values ---------------------- //\r
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
}`;var ge=`// ------------------------- Object Values ---------------------- //\r
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
}`;var pe=`// ------------------------- Object Values ---------------------- //\r
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
}`;var xe=`// ------------------------- Object Values ---------------------- //\r
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
}`;var be=`// ------------------------- Object Values ---------------------- //\r
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
}`;var ye=`// ------------------------- Object Values ---------------------- //\r
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
}`;var we=[-1,1,0,1,1,1,0,1,1,-1,0,1,-1,-1,0,1],ve=[0,0,1,0,0,1,1,0,1,1,0,1],De=[0,0,-1,0,0,0,-1,0,0,0,-1,0,0,0,-1,0,0,0,-1,0,0,0,-1,0],Se=[0,1,3,1,2,3];var xt=[-1,1,1,1,1,1,1,1,1,-1,1,1,-1,-1,1,1,-1,1,-1,1,1,1,-1,1,1,-1,-1,1,-1,-1,-1,1],oe=[.33333,.25,.66666,.25,.66666,.5,.33333,.25,.66666,.5,.33333,.5,.66666,1,.33333,1,.33333,.75,.66666,1,.33333,.75,.66666,.75,0,.25,.33333,.25,.33333,.5,0,.25,.33333,.5,0,.5,.66666,.25,1,.25,1,.5,.66666,.25,1,.5,.66666,.5,.33333,0,.66666,0,.66666,.25,.33333,0,.66666,.25,.33333,.25,.33333,.5,.66666,.5,.66666,.75,.33333,.5,.66666,.75,.33333,.75],ae=[0,0,-1,0,0,0,-1,0,0,0,-1,0,0,0,-1,0,0,0,-1,0,0,0,-1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,-1,0,0,0,-1,0,0,0,-1,0,0,0,-1,0,0,0,-1,0,0,0,-1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,-1,0,0,0,-1,0,0,0,-1,0,0,0,-1,0,0,0,-1,0,0,0,-1,0,0],bt=[4,5,6,4,6,7,1,0,3,1,3,2,0,4,7,0,7,3,5,1,2,5,2,6,0,1,5,0,5,4,7,6,2,7,2,3];var Ce=[-1,.5,0,1,0,0,0,-.5,0,1,.5,1,-1,-.5,-.6,1,0,1,-1,.5,0,1,0,0,0,.5,0,1,.5,0,0,-.5,0,1,.5,1,0,.5,0,1,.5,0,1,-.5,-.6,1,1,1,0,-.5,0,1,.5,1,0,.5,0,1,.5,0,1,.5,-1.2,1,1,0,1,-.5,-.6,1,1,1],le=[0,1,2,3,4,5,6,7,8,9,10,11];var Le=(i,t,e)=>{let r=new v;r.set("Forward",0),r.set("Back",0),r.set("Left",0),r.set("Right",0),r.set("Up",0),r.set("Down",0),r.set("RotateLeft",0),r.set("RotateRight",0),r.set("Yaw",0),r.set("Pitch",0),window.addEventListener("keydown",n=>{switch(n.code){case"KeyW":r.set("Forward",1);break;case"KeyS":r.set("Back",1);break;case"KeyA":r.set("Left",1);break;case"KeyD":r.set("Right",1);break;case"ShiftLeft":r.set("Up",1);break;case"ControlLeft":r.set("Down",1);break;case"KeyQ":r.set("RotateLeft",1);break;case"KeyE":r.set("RotateRight",1);break}}),window.addEventListener("keyup",n=>{switch(n.code){case"KeyW":r.set("Forward",0);break;case"KeyS":r.set("Back",0);break;case"KeyA":r.set("Left",0);break;case"KeyD":r.set("Right",0);break;case"ShiftLeft":r.set("Up",0);break;case"ControlLeft":r.set("Down",0);break;case"KeyQ":r.set("RotateLeft",0);break;case"KeyE":r.set("RotateRight",0);break}});let a=null;window.addEventListener("mousemove",n=>{let s=n.movementX,l=n.movementY,c=.5,u=Math.max(-1,Math.min(1,s*c)),h=Math.max(-1,Math.min(1,l*c));r.set("Yaw",u),r.set("Pitch",h),a!==null&&clearTimeout(a),a=setTimeout(()=>{r.set("Yaw",0),r.set("Pitch",0)},16)}),i.addEventListener("click",()=>{i.requestPointerLock()}),window.setInterval(()=>{r.get("Forward")>0&&t.transformation.translateInDirection(r.get("Forward")/50*10,0,0),r.get("Back")>0&&t.transformation.translateInDirection(-(r.get("Back")/50)*10,0,0),r.get("Right")>0&&t.transformation.translateInDirection(0,r.get("Right")/50*10,0),r.get("Left")>0&&t.transformation.translateInDirection(0,-(r.get("Left")/50)*10,0),r.get("Up")>0&&t.transformation.translateInDirection(0,0,r.get("Up")/50*10),r.get("Down")>0&&t.transformation.translateInDirection(0,0,-(r.get("Down")/50)*10),(r.get("Yaw")>0||r.get("Yaw")<0)&&t.transformation.addEulerRotation(0,r.get("Yaw"),0),(r.get("Pitch")>0||r.get("Pitch")<0)&&t.transformation.addEulerRotation(r.get("Pitch"),0,0),r.get("RotateLeft")>0&&t.transformation.addEulerRotation(0,0,r.get("RotateLeft")),r.get("RotateRight")>0&&t.transformation.addEulerRotation(0,0,-r.get("RotateRight")),e.write(new Float32Array(t.getMatrix(N.ViewProjection).dataArray).buffer,0),e.write(new Float32Array(t.getMatrix(N.View).dataArray).buffer,64),e.write(new Float32Array(t.getMatrix(N.Projection).dataArray).buffer,128),e.write(new Float32Array([t.transformation.translationX,t.transformation.translationY,t.transformation.translationZ]).buffer,448),e.write(new Float32Array(t.getMatrix(N.Rotation).dataArray).buffer,192),e.write(new Float32Array(t.getMatrix(N.Translation).dataArray).buffer,256),e.write(new Float32Array(t.getMatrix(N.Rotation).inverse().dataArray).buffer,320),e.write(new Float32Array(t.getMatrix(N.Translation).inverse().dataArray).buffer,384)},8)},Te=(()=>{let i=0;return(t,e)=>{let r=document.getElementById("fps-display"),a=r.getContext("2d",{willReadFrequently:!0});if(e!==r.width&&(r.width=e,r.height=30),r.width<2)return;let n=a.getImageData(1,0,r.width-1,r.height),s=1;i<t&&(s=i/t,i=t),s===1?a.clearRect(r.width-1,0,1,r.height):a.clearRect(0,0,r.width,r.height);let l=Math.floor(r.height*s);a.putImageData(n,0,r.height-l,0,0,r.width-1,l);let c=t/i*r.height;a.fillStyle="#87beee",a.fillRect(r.width-1,r.height-c,1,c)}})();var Ve=(i,t,e)=>{let l=new H(i,fe).setup(g=>{g.parameter("animationSeconds",S.Vertex),g.vertexEntryPoint("vertex_main",new J(i).setup(p=>{p.buffer("position",O.Index).withParameter("position",0,y.Float32,L.Vector4),p.buffer("uv",O.Vertex).withParameter("uv",1,y.Float32,L.Vector2),p.buffer("normal",O.Vertex).withParameter("normal",2,y.Float32,L.Vector4)})),g.fragmentEntryPoint("fragment_main",t),g.group(0,new k(i,"object").setup(p=>{p.binding(0,"transformationMatrix",S.Vertex).asBuffer(64),p.binding(1,"instancePositions",S.Vertex,B.Read).asBuffer(0,16)})),g.group(1,e.layout),g.group(2,new k(i,"user").setup(p=>{p.binding(0,"cubeTextureSampler",S.Fragment).asSampler(nt.Filter),p.binding(1,"cubeTexture",S.Fragment|S.Vertex).asTexture("2d-array","rgba8unorm")}))}).createRenderModule("vertex_main","fragment_main"),c=l.layout.getGroupLayout("object").create();c.data("transformationMatrix").createBufferWithRawData(new Float32Array(new j().setScale(1,1,1).getMatrix(M.Transformation).dataArray).buffer);let u=new Array;for(let g=0;g<50;g++)for(let p=0;p<50;p++)for(let b=0;b<50;b++)u.push(g*3,p*3,b*3,1);c.data("instancePositions").createBufferWithRawData(new Float32Array(u).buffer);let h=l.layout.getGroupLayout("user").create(),f=h.data("cubeTexture").createTexture().texture;f.depth=3,f.mipCount=20,(async()=>{let g=["./source/game_objects/cube/texture_one/cube-texture.png","./source/game_objects/cube/texture_two/cube-texture.png","./source/game_objects/cube/texture_three/cube-texture.png"],p=0,b=0,Z=new Array;for(let ut=0;ut<20;ut++)Z.push("#"+Math.floor(Math.random()*16777215).toString(16));let R=g.map(async(ut,yt)=>{let W=new Image;if(W.src=ut,await W.decode(),(p===0||b===0)&&(b=W.naturalWidth,p=W.naturalHeight),p!==W.naturalHeight||b!==W.naturalWidth)throw new Error(`Texture image layers are not the same size. (${W.naturalWidth}, ${W.naturalHeight}) needs (${b}, ${p}).`);let _=new Array,ne=new Array;_.push(createImageBitmap(W).then(et=>{ne.push({data:et,mipLevel:0,targetOrigin:{x:0,y:0,z:yt}})}));let Re=1+Math.floor(Math.log2(Math.max(b,p)));for(let et=1;et<Re;et++){let ct=new OffscreenCanvas(Math.max(1,Math.floor(b/Math.pow(2,et))),Math.max(1,Math.floor(p/Math.pow(2,et)))),ft=ct.getContext("2d");ft.globalAlpha=1,ft.drawImage(W,0,0,b,p,0,0,ct.width,ct.height),ft.globalAlpha=.5,ft.fillStyle=Z[et],ft.fillRect(0,0,ct.width,ct.height),_.push(createImageBitmap(ct).then(Be=>{ne.push({data:Be,mipLevel:et,targetOrigin:{x:0,y:0,z:yt}})}))}return await Promise.all(_),ne}).flat(),I=(await Promise.all(R)).flat();f.width=b,f.height=p,f.depth=g.length,f.copyFrom(...I),f.width=f.width*2;let P=f.native;f.width=f.width/2})(),h.data("cubeTextureSampler").createSampler();let x=l.vertexParameter.create(bt);x.create("position",xt),x.create("uv",oe),x.create("normal",ae);let w=l.create();return w.primitiveCullMode=K.Front,w.setParameter("animationSeconds",3),window.animationSpeed=g=>{w.setParameter("animationSeconds",g)},{pipeline:w,parameter:x,instanceCount:50*50*50,data:w.layout.withData(g=>{g.addGroup(c),g.addGroup(e),g.addGroup(h)})}},ke=(i,t,e)=>{let a=new H(i,de).setup(f=>{f.vertexEntryPoint("vertex_main",new J(i).setup(x=>{x.buffer("position",O.Index).withParameter("position",0,y.Float32,L.Vector4),x.buffer("normal",O.Vertex).withParameter("normal",1,y.Float32,L.Vector4)})),f.fragmentEntryPoint("fragment_main",t),f.group(0,new k(i,"object").setup(x=>{x.binding(0,"transformationMatrix",S.Vertex).asBuffer(64,0,!0),x.binding(1,"color",S.Vertex).asBuffer(16,0,!0)})),f.group(1,e.layout)}).createRenderModule("vertex_main","fragment_main"),n=a.layout.getGroupLayout("object").create();n.data("transformationMatrix").createBuffer(3);let s=n.data("transformationMatrix").getRaw();s.write(new Float32Array(new j().setScale(1,1,1).setTranslation(2,-30,5).getMatrix(M.Transformation).dataArray).buffer,0),s.write(new Float32Array(new j().setScale(1,1,1).setTranslation(0,-30,5).getMatrix(M.Transformation).dataArray).buffer,64),s.write(new Float32Array(new j().setScale(1,1,1).setTranslation(-2,-30,5).getMatrix(M.Transformation).dataArray).buffer,128),n.data("color").createBuffer(2);let l=n.data("color").getRaw(),c=l.size/2;l.write(new Float32Array([.89,.74,0,1]).buffer,0),l.write(new Float32Array([.92,.48,.14,1]).buffer,c);let u=a.vertexParameter.create(bt);u.create("position",xt),u.create("normal",ae);let h=a.create();return h.primitiveCullMode=K.Front,[{pipeline:h,parameter:u,instanceCount:1,data:h.layout.withData(f=>{f.addGroup(n).withOffset("color",0).withOffset("transformationMatrix",0),f.addGroup(e)})},{pipeline:h,parameter:u,instanceCount:1,data:h.layout.withData(f=>{f.addGroup(n).withOffset("color",1).withOffset("transformationMatrix",1),f.addGroup(e)})},{pipeline:h,parameter:u,instanceCount:1,data:h.layout.withData(f=>{f.addGroup(n).withOffset("color",0).withOffset("transformationMatrix",2),f.addGroup(e)})}]},_e=(i,t,e)=>{let r=new H(i,xe).setup(u=>{u.vertexEntryPoint("vertex_main",new J(i).setup(h=>{h.buffer("position",O.Index).withParameter("position",0,y.Float32,L.Vector4),h.buffer("uv",O.Vertex).withParameter("uv",1,y.Float32,L.Vector2),h.buffer("normal",O.Vertex).withParameter("normal",2,y.Float32,L.Vector4)})),u.fragmentEntryPoint("fragment_main",t),u.group(0,new k(i,"object").setup(h=>{h.binding(0,"transformationMatrix",S.Vertex).asBuffer(64)})),u.group(1,e.layout)}),a=r.createRenderModule("vertex_main","fragment_main"),n=r.layout.getGroupLayout("object").create();n.data("transformationMatrix").createBufferWithRawData(new Float32Array(new j().setScale(1,1,1).getMatrix(M.Transformation).dataArray).buffer);let s=a.create();s.primitiveCullMode=K.Front;let l=a.vertexParameter.create(bt);return l.create("position",xt),l.create("uv",oe),l.create("normal",ae),{pipeline:s,parameter:l,instanceCount:3,data:s.layout.withData(u=>{u.addGroup(n),u.addGroup(e)})}},We=(i,t,e)=>{let r=new H(i,be).setup(u=>{u.vertexEntryPoint("vertex_main",new J(i).setup(h=>{h.buffer("position",O.Index).withParameter("position",0,y.Float32,L.Vector4)})),u.fragmentEntryPoint("fragment_main",t),u.group(0,new k(i,"object").setup(h=>{h.binding(0,"cubeTextureSampler",S.Fragment).asSampler(nt.Filter),h.binding(1,"cubeMap",S.Fragment).asTexture("cube","rgba8unorm")})),u.group(1,e.layout)}),a=r.createRenderModule("vertex_main","fragment_main"),n=r.layout.getGroupLayout("object").create(),s=n.data("cubeMap").createTexture().texture;s.depth=6,(async()=>{let u=["./source/game_objects/skybox/right.jpg","./source/game_objects/skybox/left.jpg","./source/game_objects/skybox/top.jpg","./source/game_objects/skybox/bottom.jpg","./source/game_objects/skybox/front.jpg","./source/game_objects/skybox/back.jpg"],h=0,f=0,x=u.map(async g=>{let p=new Image;if(p.src=g,await p.decode(),(h===0||f===0)&&(f=p.naturalWidth,h=p.naturalHeight),h!==p.naturalHeight||f!==p.naturalWidth)throw new Error(`Texture image layers are not the same size. (${p.naturalWidth}, ${p.naturalHeight}) needs (${f}, ${h}).`);return createImageBitmap(p)}),w=await Promise.all(x);s.width=f,s.height=h,s.depth=u.length,s.copyFrom(...w)})(),n.data("cubeTextureSampler").createSampler();let l=a.vertexParameter.create(bt);l.create("position",xt);let c=a.create();return c.primitiveCullMode=K.Back,c.depthConfig().enableWrite(!1).compareWith(at.Allways),{pipeline:c,parameter:l,instanceCount:1,data:c.layout.withData(u=>{u.addGroup(n),u.addGroup(e)})}},Ye=(i,t,e)=>{let a=new H(i,ye).setup(x=>{x.vertexEntryPoint("vertex_main",new J(i).setup(w=>{w.buffer("position",O.Index).withParameter("position",0,y.Float32,L.Vector4),w.buffer("uv",O.Vertex).withParameter("uv",1,y.Float32,L.Vector2),w.buffer("normal",O.Vertex).withParameter("normal",2,y.Float32,L.Vector4)})),x.fragmentEntryPoint("fragment_main",t),x.group(0,new k(i,"object").setup(w=>{w.binding(0,"transformationMatrix",S.Vertex).asBuffer(64)})),x.group(1,e.layout),x.group(2,new k(i,"user").setup(w=>{w.binding(0,"videoTextureSampler",S.Fragment).asSampler(nt.Filter),w.binding(1,"videoTexture",S.Fragment).asTexture("2d","rgba8unorm")}))}).createRenderModule("vertex_main","fragment_main"),n=a.layout.getGroupLayout("object").create();n.data("transformationMatrix").createBufferWithRawData(new Float32Array(new j().addTranslation(-.5,-.5,100).setScale(15,8.4,0).getMatrix(M.Transformation).dataArray).buffer);let s=a.layout.getGroupLayout("user").create(),l=s.data("videoTexture").createTexture().texture,c=document.createElement("video");c.preload="auto",c.loop=!0,c.muted=!0,c.src="./source/game_objects/video_canvas/earth.mp4",c.addEventListener("resize",()=>{l.height=Math.max(c.videoHeight,1),l.width=Math.max(c.videoWidth,1)}),c.play();let u=performance.now();i.addTickListener(()=>{if(c.readyState>1){let x=performance.now();createImageBitmap(c).then(w=>{x<u||(u=x,l.copyFrom(w))})}}),s.data("videoTextureSampler").createSampler();let h=a.vertexParameter.create(Se);h.create("position",we),h.create("uv",ve),h.create("normal",De);let f=a.create();return f.primitiveCullMode=K.None,f.depthConfig().enableWrite(!1),f.targetConfig("color").alphaBlend(it.Add,U.One,U.OneMinusSrcAlpha).colorBlend(it.Add,U.SrcAlpha,U.OneMinusSrcAlpha),{pipeline:f,parameter:h,instanceCount:1,data:f.layout.withData(x=>{x.addGroup(n),x.addGroup(e),x.addGroup(s)})}},ze=(i,t,e)=>{let a=new H(i,pe).setup(R=>{R.parameter("animationSeconds",S.Vertex),R.vertexEntryPoint("vertex_main",new J(i).setup(I=>{I.buffer("position-uv",O.Index).withParameter("position",0,y.Float32,L.Vector4).withParameter("uv",1,y.Float32,L.Vector2)})),R.fragmentEntryPoint("fragment_main",t),R.computeEntryPoint("compute_main",64),R.group(0,new k(i,"object").setup(I=>{I.binding(0,"transformationMatrix",S.Vertex).asBuffer(64),I.binding(1,"particles",S.Vertex,B.Read).asBuffer(0,48)})),R.group(1,e.layout),R.group(2,new k(i,"user").setup(I=>{I.binding(0,"textureSampler",S.Fragment).asSampler(nt.Filter),I.binding(1,"texture",S.Fragment).asTexture("2d","rgba8unorm")}))}),n=a.createRenderModule("vertex_main","fragment_main"),s=n.layout.getGroupLayout("object").create();s.data("particles").createBuffer(18e3),s.data("transformationMatrix").createBufferWithRawData(new Float32Array(new j().setScale(.02,.02,.02).getMatrix(M.Transformation).dataArray).buffer);let l=a.layout.getGroupLayout("user").create(),c=l.data("texture").createTexture().texture;c.depth=6,(async()=>{let R=["./source/game_objects/leaf_particle/leaf.png"],I=0,P=0,ut=R.map(async W=>{let _=new Image;if(_.src=W,await _.decode(),(I===0||P===0)&&(P=_.naturalWidth,I=_.naturalHeight),I!==_.naturalHeight||P!==_.naturalWidth)throw new Error(`Texture image layers are not the same size. (${_.naturalWidth}, ${_.naturalHeight}) needs (${P}, ${I}).`);return createImageBitmap(_)}),yt=await Promise.all(ut);c.width=P,c.height=I,c.depth=R.length,c.copyFrom(...yt)})(),l.data("textureSampler").createSampler();let u=n.vertexParameter.create(le);u.create("position-uv",Ce);let h=n.create();h.primitiveCullMode=K.None,h.depthConfig().enableWrite(!0).compareWith(at.Less),h.targetConfig("color").alphaBlend(it.Add,U.One,U.OneMinusSrcAlpha).colorBlend(it.Add,U.SrcAlpha,U.OneMinusSrcAlpha);let f=new F(i,4*4).initialData(new Uint32Array([le.length,0,0,0]).buffer),x={pipeline:h,parameter:u,instanceCount:0,data:h.layout.withData(R=>{R.addGroup(l),R.addGroup(e),R.addGroup(s)}),indirectBuffer:f},g=new H(i,ge).setup(R=>{R.parameter("animationSeconds",S.Vertex),R.computeEntryPoint("compute_main",64),R.group(0,new k(i,"object").setup(I=>{I.binding(0,"particles",S.Compute,B.ReadWrite).asBuffer(0,48),I.binding(1,"indirect",S.Compute,B.ReadWrite).asBuffer(16)})),R.group(1,e.layout)}).createComputeModule("compute_main"),p=new ht(i,g);p.setParameter("animationSeconds",30);let b=g.layout.getGroupLayout("object").create();b.data("particles").set(s.data("particles").getRaw()),b.data("indirect").set(f);let Z={pipeline:p,data:p.layout.withData(R=>{R.addGroup(b),R.addGroup(e)}),dimensions:{x:Math.ceil(18e3/(g.workGroupSizeX*g.workGroupSizeY*g.workGroupSizeZ)),y:1,z:1}};return[x,Z]},je=i=>{let e=new k(i,"world").setup(n=>{n.binding(0,"camera",S.Vertex|S.Compute).asBuffer(464),n.binding(1,"timestamp",S.Vertex|S.Fragment|S.Compute).asBuffer(8),n.binding(2,"ambientLight",S.Fragment).asBuffer(16),n.binding(3,"pointLights",S.Fragment|S.Vertex,B.Read).asBuffer(0,48),n.binding(4,"debugValue",S.Fragment|S.Compute,B.ReadWrite).asBuffer(4)}).create();e.data("camera").createBuffer();let r=new te;r.setColor(.3,.3,.3),e.data("ambientLight").createBufferWithRawData(new Float32Array(r.data).buffer),e.data("pointLights").createBufferWithRawData(new Float32Array([1,1,1,1,1,0,0,1,200,0,0,0,10,10,10,1,0,0,1,1,200,0,0,0,-10,10,10,1,0,1,0,1,200,0,0,0]).buffer),e.data("timestamp").createBuffer(),e.data("debugValue").createBuffer();let a=e.data("debugValue").getRaw();return window.debugBuffer=()=>{a.read(0,4).then(n=>{console.log(new Float32Array(n))})},e};(async()=>{let i=await It.request("high-performance",{features:[{name:G.TimestampQuery,required:!0}]}),t=new Jt(i,document.getElementById("canvas")),e=new Vt(i,!0).setup(b=>{b.addColor("color",0,"bgra8unorm",!0,{r:0,g:1,b:0,a:0}),b.addDepthStencil("depth24plus",!0,1)}),r=e.create(b=>{b.setOwnColorTarget("color",t)});(()=>{let b=document.querySelector(".canvas-wrapper");new ResizeObserver(()=>{let Z=Math.max(0,b.clientHeight-20),R=Math.max(b.clientWidth-20,0);r.resize(Z,R)}).observe(b)})();let a=new re;a.aspectRatio=r.width/r.height,a.angleOfView=72,a.near=.1,a.far=Number.MAX_SAFE_INTEGER,r.addInvalidationListener(()=>{a.aspectRatio=r.width/r.height},Ut.Resize);let n=new ie(a);n.transformation.setTranslation(0,0,-4);let s=je(i),l=s.data("timestamp").getRaw(),[c,u]=ze(i,e,s),h=[We(i,e,s),Ve(i,e,s),_e(i,e,s),Ye(i,e,s),...ke(i,e,s),c],f=[u];Le(t.canvas,n,s.data("camera").getRaw());let x=document.getElementById("fpsCounter"),w=0,g=0,p=b=>{i.processTick();let Z=1e3/(b-w);g=(1-.05)*g+.05*Z,l.write(new Float32Array([b/1e3,(b-w)/1e3]).buffer,0),w=b,i.execute(R=>{R.computePass(I=>{for(let P of f)I.computeDirect(P.pipeline,P.data,P.dimensions.x,P.dimensions.y,P.dimensions.z)}),R.renderPass(r,I=>{for(let P of h)P.indirectBuffer?I.drawIndirect(P.pipeline,P.parameter,P.data,P.indirectBuffer):I.drawDirect(P.pipeline,P.parameter,P.data,P.instanceCount)})}),Te(Z,r.width),x.textContent=g.toFixed(0),requestAnimationFrame(p)};requestAnimationFrame(p)})();})();
//# sourceMappingURL=page.js.map
