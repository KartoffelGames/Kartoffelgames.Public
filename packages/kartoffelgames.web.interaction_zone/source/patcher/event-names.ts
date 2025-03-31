export class EventNames {
    public static readonly DETAIL = ['toggle'];
    public static readonly DOCUMENT = [
        'afterscriptexecute', 'beforescriptexecute', 'DOMContentLoaded', 'freeze', 'fullscreenchange',
        'mozfullscreenchange', 'webkitfullscreenchange', 'msfullscreenchange', 'fullscreenerror',
        'mozfullscreenerror', 'webkitfullscreenerror', 'msfullscreenerror', 'readystatechange',
        'visibilitychange', 'resume'
    ] as const;
    public static readonly FORM = ['autocomplete', 'autocompleteerror'] as const;
    public static readonly FRAME = ['load'] as const;
    public static readonly FRAME_SET = ['blur', 'error', 'focus', 'load', 'resize', 'scroll', 'messageerror'] as const;
    public static readonly GLOBAL_EVENT_HANDLER = [
        'abort', 'animationcancel', 'animationend', 'animationiteration', 'auxclick', 'beforeinput', 'blur',
        'cancel', 'canplay', 'canplaythrough', 'change', 'compositionstart', 'compositionupdate',
        'compositionend', 'cuechange', 'click', 'close', 'contextmenu', 'curechange', 'dblclick', 'drag',
        'dragend', 'dragenter', 'dragexit', 'dragleave', 'dragover', 'drop', 'durationchange', 'emptied',
        'ended', 'error', 'focus', 'focusin', 'focusout', 'gotpointercapture', 'input', 'invalid', 'keydown',
        'keypress', 'keyup', 'load', 'loadstart', 'loadeddata', 'loadedmetadata', 'lostpointercapture',
        'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'mousewheel',
        'orientationchange', 'pause', 'play', 'playing', 'pointercancel', 'pointerdown', 'pointerenter',
        'pointerleave', 'pointerlockchange', 'mozpointerlockchange', 'webkitpointerlockerchange',
        'pointerlockerror', 'mozpointerlockerror', 'webkitpointerlockerror', 'pointermove', 'pointout',
        'pointerover', 'pointerup', 'progress', 'ratechange', 'reset', 'resize', 'scroll', 'seeked', 'seeking',
        'select', 'selectionchange', 'selectstart', 'show', 'sort', 'stalled', 'submit', 'suspend', 'timeupdate',
        'volumechange', 'touchcancel', 'touchmove', 'touchstart', 'touchend', 'transitioncancel',
        'transitionend', 'waiting', 'wheel'
    ] as const;
    public static readonly HTML_ELEMENT = [
        'beforecopy', 'beforecut', 'beforepaste', 'copy', 'cut', 'paste', 'dragstart', 'loadend',
        'animationstart', 'search', 'transitionrun', 'transitionstart', 'webkitanimationend',
        'webkitanimationiteration', 'webkitanimationstart', 'webkittransitionend'
    ] as const;
    public static readonly IDB_INDEX = [
        'upgradeneeded', 'complete', 'abort', 'success', 'error', 'blocked', 'versionchange', 'close'
    ] as const;
    public static readonly MARQUEE = ['bounce', 'finish', 'start'] as const;
    public static readonly MEDIA_ELEMENT = [
        'encrypted', 'waitingforkey', 'msneedkey', 'mozinterruptbegin', 'mozinterruptend'
    ] as const;
    public static readonly NOTIFICATION = ['click', 'show', 'error', 'close'] as const;
    public static readonly RTC_PEER_CONNECTION = [
        'connectionstatechange', 'datachannel', 'icecandidate', 'icecandidateerror',
        'iceconnectionstatechange', 'icegatheringstatechange', 'negotiationneeded', 'signalingstatechange', 'track'] as const;
    public static readonly WEBGL = ['webglcontextrestored', 'webglcontextlost', 'webglcontextcreationerror'] as const;
    public static readonly WEBSOCKET = ['close', 'error', 'open', 'message'] as const;
    public static readonly WINDOW = [
        'absolutedeviceorientation', 'afterinput', 'afterprint', 'appinstalled', 'beforeinstallprompt',
        'beforeprint', 'beforeunload', 'devicelight', 'devicemotion', 'deviceorientation',
        'deviceorientationabsolute', 'deviceproximity', 'hashchange', 'languagechange', 'message',
        'mozbeforepaint', 'offline', 'online', 'paint', 'pageshow', 'pagehide', 'popstate',
        'rejectionhandled', 'storage', 'unhandledrejection', 'unload', 'userproximity',
        'vrdisplyconnected', 'vrdisplaydisconnected', 'vrdisplaypresentchange'
    ] as const;
    public static readonly WORKER = ['error', 'message'];
    public static readonly XML_HTTP_REQUEST = [
        'loadstart', 'progress', 'abort', 'error', 'load', 'progress', 'timeout', 'loadend',
        'readystatechange'
    ] as const;

    // eslint-disable-next-line @typescript-eslint/member-ordering
    public static readonly ALL = [
        ...EventNames.GLOBAL_EVENT_HANDLER, ...EventNames.WEBGL,
        ...EventNames.FORM, ...EventNames.DETAIL, ...EventNames.DOCUMENT,
        ...EventNames.WINDOW, ...EventNames.HTML_ELEMENT
    ] as const;
}