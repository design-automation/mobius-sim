// Header for verb for JavaScript
// Borrowed from browserify, this header supports AMD (define) and common js (require) style modules
(function (f) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = f();
    }
    else if (typeof define === "function" && define.amd) {
        define([], f);
    }
    else {
        var g;
        if (typeof window !== "undefined") {
            g = window;
        }
        else if (typeof global !== "undefined") {
            g = global;
        }
        else if (typeof self !== "undefined") {
            g = self;
        }
        else {
            g = this;
        }
        g.verb = f();
    }
})(function () {
    var verb = {};
    var global = this;
    var isBrowser = new Function("try {return this===window;}catch(e){ return false;}");
    // var isNode=new Function("try {return this===global;}catch(e){return false;}");
    // var isWebworker=new Function("try {return typeof importScripts === 'function';}catch(e){return false;}");
    // // node.js context, but not WebWorker
    // if ( isNode() && !isWebworker() ){
    //     Worker = require('webworker-threads').Worker;
    // }
    // // WebWorker or node.js context
    // if ( isNode() || isWebworker() ){
    //     var window = global; // required for promhx
    //     // WebWorker
    //     if ( isWebworker() ){
    //         var lookup = function(className, methodName){
    //             var obj = global;
    //             className.split(".").forEach(function(x){
    //                 if (obj) obj = obj[ x ];
    //             });
    //             if (!obj) return null;
    //             return obj[ methodName ];
    //         }
    //         onmessage = function( e ){
    //             if (!e.data.className || !e.data.methodName) return;
    //             var method = lookup( e.data.className, e.data.methodName );
    //             if (!method){
    //                 return console.error("could not find " + e.data.className + "." + e.data.methodName)
    //             }
    //             postMessage( { result: method.apply( null, e.data.args ), id: e.data.id } );
    //         };
    //     }
    // }
    (function (console, $hx_exports, $global) {
        "use strict";
        $hx_exports.geom = $hx_exports.geom || {};
        $hx_exports.exe = $hx_exports.exe || {};
        $hx_exports.eval = $hx_exports.eval || {};
        $hx_exports.core = $hx_exports.core || {};
        $hx_exports.promhx = $hx_exports.promhx || {};
        var $hxClasses = {}, $estr = function () { return js_Boot.__string_rec(this, ''); };
        function $extend(from, fields) {
            function Inherit() { }
            Inherit.prototype = from;
            var proto = new Inherit();
            for (var name in fields)
                proto[name] = fields[name];
            if (fields.toString !== Object.prototype.toString)
                proto.toString = fields.toString;
            return proto;
        }
        var HxOverrides = function () { };
        $hxClasses["HxOverrides"] = HxOverrides;
        HxOverrides.__name__ = ["HxOverrides"];
        HxOverrides.strDate = function (s) {
            var _g = s.length;
            switch (_g) {
                case 8:
                    var k = s.split(":");
                    var d = new Date();
                    d.setTime(0);
                    d.setUTCHours(k[0]);
                    d.setUTCMinutes(k[1]);
                    d.setUTCSeconds(k[2]);
                    return d;
                case 10:
                    var k1 = s.split("-");
                    return new Date(k1[0], k1[1] - 1, k1[2], 0, 0, 0);
                case 19:
                    var k2 = s.split(" ");
                    var y = k2[0].split("-");
                    var t = k2[1].split(":");
                    return new Date(y[0], y[1] - 1, y[2], t[0], t[1], t[2]);
                default:
                    throw new js__$Boot_HaxeError("Invalid date format : " + s);
            }
        };
        HxOverrides.cca = function (s, index) {
            var x = s.charCodeAt(index);
            if (x != x)
                return undefined;
            return x;
        };
        HxOverrides.substr = function (s, pos, len) {
            if (pos != null && pos != 0 && len != null && len < 0)
                return "";
            if (len == null)
                len = s.length;
            if (pos < 0) {
                pos = s.length + pos;
                if (pos < 0)
                    pos = 0;
            }
            else if (len < 0)
                len = s.length + len - pos;
            return s.substr(pos, len);
        };
        HxOverrides.iter = function (a) {
            return { cur: 0, arr: a, hasNext: function () {
                    return this.cur < this.arr.length;
                }, next: function () {
                    return this.arr[this.cur++];
                } };
        };
        var Lambda = function () { };
        $hxClasses["Lambda"] = Lambda;
        Lambda.__name__ = ["Lambda"];
        Lambda.fold = function (it, f, first) {
            var $it0 = $iterator(it)();
            while ($it0.hasNext()) {
                var x = $it0.next();
                first = f(x, first);
            }
            return first;
        };
        var List = function () {
            this.length = 0;
        };
        $hxClasses["List"] = List;
        List.__name__ = ["List"];
        List.prototype = {
            add: function (item) {
                var x = [item];
                if (this.h == null)
                    this.h = x;
                else
                    this.q[1] = x;
                this.q = x;
                this.length++;
            },
            pop: function () {
                if (this.h == null)
                    return null;
                var x = this.h[0];
                this.h = this.h[1];
                if (this.h == null)
                    this.q = null;
                this.length--;
                return x;
            },
            isEmpty: function () {
                return this.h == null;
            },
            __class__: List
        };
        Math.__name__ = ["Math"];
        var Reflect = function () { };
        $hxClasses["Reflect"] = Reflect;
        Reflect.__name__ = ["Reflect"];
        Reflect.field = function (o, field) {
            try {
                return o[field];
            }
            catch (e) {
                if (e instanceof js__$Boot_HaxeError)
                    e = e.val;
                return null;
            }
        };
        Reflect.callMethod = function (o, func, args) {
            return func.apply(o, args);
        };
        Reflect.fields = function (o) {
            var a = [];
            if (o != null) {
                var hasOwnProperty = Object.prototype.hasOwnProperty;
                for (var f in o) {
                    if (f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o, f))
                        a.push(f);
                }
            }
            return a;
        };
        Reflect.isFunction = function (f) {
            return typeof (f) == "function" && !(f.__name__ || f.__ename__);
        };
        Reflect.deleteField = function (o, field) {
            if (!Object.prototype.hasOwnProperty.call(o, field))
                return false;
            delete (o[field]);
            return true;
        };
        var Std = function () { };
        $hxClasses["Std"] = Std;
        Std.__name__ = ["Std"];
        Std.string = function (s) {
            return js_Boot.__string_rec(s, "");
        };
        Std.parseFloat = function (x) {
            return parseFloat(x);
        };
        var StringBuf = function () {
            this.b = "";
        };
        $hxClasses["StringBuf"] = StringBuf;
        StringBuf.__name__ = ["StringBuf"];
        StringBuf.prototype = {
            add: function (x) {
                this.b += Std.string(x);
            },
            __class__: StringBuf
        };
        var StringTools = function () { };
        $hxClasses["StringTools"] = StringTools;
        StringTools.__name__ = ["StringTools"];
        StringTools.fastCodeAt = function (s, index) {
            return s.charCodeAt(index);
        };
        var ValueType = $hxClasses["ValueType"] = { __ename__: ["ValueType"], __constructs__: ["TNull", "TInt", "TFloat", "TBool", "TObject", "TFunction", "TClass", "TEnum", "TUnknown"] };
        ValueType.TNull = ["TNull", 0];
        ValueType.TNull.toString = $estr;
        ValueType.TNull.__enum__ = ValueType;
        ValueType.TInt = ["TInt", 1];
        ValueType.TInt.toString = $estr;
        ValueType.TInt.__enum__ = ValueType;
        ValueType.TFloat = ["TFloat", 2];
        ValueType.TFloat.toString = $estr;
        ValueType.TFloat.__enum__ = ValueType;
        ValueType.TBool = ["TBool", 3];
        ValueType.TBool.toString = $estr;
        ValueType.TBool.__enum__ = ValueType;
        ValueType.TObject = ["TObject", 4];
        ValueType.TObject.toString = $estr;
        ValueType.TObject.__enum__ = ValueType;
        ValueType.TFunction = ["TFunction", 5];
        ValueType.TFunction.toString = $estr;
        ValueType.TFunction.__enum__ = ValueType;
        ValueType.TClass = function (c) { var $x = ["TClass", 6, c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
        ValueType.TEnum = function (e) { var $x = ["TEnum", 7, e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
        ValueType.TUnknown = ["TUnknown", 8];
        ValueType.TUnknown.toString = $estr;
        ValueType.TUnknown.__enum__ = ValueType;
        var Type = function () { };
        $hxClasses["Type"] = Type;
        Type.__name__ = ["Type"];
        Type.getClassName = function (c) {
            var a = c.__name__;
            if (a == null)
                return null;
            return a.join(".");
        };
        Type.getEnumName = function (e) {
            var a = e.__ename__;
            return a.join(".");
        };
        Type.resolveClass = function (name) {
            var cl = $hxClasses[name];
            if (cl == null || !cl.__name__)
                return null;
            return cl;
        };
        Type.resolveEnum = function (name) {
            var e = $hxClasses[name];
            if (e == null || !e.__ename__)
                return null;
            return e;
        };
        Type.createEmptyInstance = function (cl) {
            function empty() { }
            ;
            empty.prototype = cl.prototype;
            return new empty();
        };
        Type.createEnum = function (e, constr, params) {
            var f = Reflect.field(e, constr);
            if (f == null)
                throw new js__$Boot_HaxeError("No such constructor " + constr);
            if (Reflect.isFunction(f)) {
                if (params == null)
                    throw new js__$Boot_HaxeError("Constructor " + constr + " need parameters");
                return Reflect.callMethod(e, f, params);
            }
            if (params != null && params.length != 0)
                throw new js__$Boot_HaxeError("Constructor " + constr + " does not need parameters");
            return f;
        };
        Type.getEnumConstructs = function (e) {
            var a = e.__constructs__;
            return a.slice();
        };
        Type["typeof"] = function (v) {
            var _g = typeof (v);
            switch (_g) {
                case "boolean":
                    return ValueType.TBool;
                case "string":
                    return ValueType.TClass(String);
                case "number":
                    if (Math.ceil(v) == v % 2147483648.0)
                        return ValueType.TInt;
                    return ValueType.TFloat;
                case "object":
                    if (v == null)
                        return ValueType.TNull;
                    var e = v.__enum__;
                    if (e != null)
                        return ValueType.TEnum(e);
                    var c = js_Boot.getClass(v);
                    if (c != null)
                        return ValueType.TClass(c);
                    return ValueType.TObject;
                case "function":
                    if (v.__name__ || v.__ename__)
                        return ValueType.TObject;
                    return ValueType.TFunction;
                case "undefined":
                    return ValueType.TNull;
                default:
                    return ValueType.TUnknown;
            }
        };
        var haxe_IMap = function () { };
        $hxClasses["haxe.IMap"] = haxe_IMap;
        haxe_IMap.__name__ = ["haxe", "IMap"];
        var haxe__$Int64__$_$_$Int64 = function (high, low) {
            this.high = high;
            this.low = low;
        };
        $hxClasses["haxe._Int64.___Int64"] = haxe__$Int64__$_$_$Int64;
        haxe__$Int64__$_$_$Int64.__name__ = ["haxe", "_Int64", "___Int64"];
        haxe__$Int64__$_$_$Int64.prototype = {
            __class__: haxe__$Int64__$_$_$Int64
        };
        var haxe_Serializer = function () {
            this.buf = new StringBuf();
            this.cache = [];
            this.useCache = haxe_Serializer.USE_CACHE;
            this.useEnumIndex = haxe_Serializer.USE_ENUM_INDEX;
            this.shash = new haxe_ds_StringMap();
            this.scount = 0;
        };
        $hxClasses["haxe.Serializer"] = haxe_Serializer;
        haxe_Serializer.__name__ = ["haxe", "Serializer"];
        haxe_Serializer.prototype = {
            toString: function () {
                return this.buf.b;
            },
            serializeString: function (s) {
                var x = this.shash.get(s);
                if (x != null) {
                    this.buf.b += "R";
                    if (x == null)
                        this.buf.b += "null";
                    else
                        this.buf.b += "" + x;
                    return;
                }
                this.shash.set(s, this.scount++);
                this.buf.b += "y";
                s = encodeURIComponent(s);
                if (s.length == null)
                    this.buf.b += "null";
                else
                    this.buf.b += "" + s.length;
                this.buf.b += ":";
                if (s == null)
                    this.buf.b += "null";
                else
                    this.buf.b += "" + s;
            },
            serializeRef: function (v) {
                var vt = typeof (v);
                var _g1 = 0;
                var _g = this.cache.length;
                while (_g1 < _g) {
                    var i = _g1++;
                    var ci = this.cache[i];
                    if (typeof (ci) == vt && ci == v) {
                        this.buf.b += "r";
                        if (i == null)
                            this.buf.b += "null";
                        else
                            this.buf.b += "" + i;
                        return true;
                    }
                }
                this.cache.push(v);
                return false;
            },
            serializeFields: function (v) {
                var _g = 0;
                var _g1 = Reflect.fields(v);
                while (_g < _g1.length) {
                    var f = _g1[_g];
                    ++_g;
                    this.serializeString(f);
                    this.serialize(Reflect.field(v, f));
                }
                this.buf.b += "g";
            },
            serialize: function (v) {
                {
                    var _g = Type["typeof"](v);
                    switch (_g[1]) {
                        case 0:
                            this.buf.b += "n";
                            break;
                        case 1:
                            var v1 = v;
                            if (v1 == 0) {
                                this.buf.b += "z";
                                return;
                            }
                            this.buf.b += "i";
                            if (v1 == null)
                                this.buf.b += "null";
                            else
                                this.buf.b += "" + v1;
                            break;
                        case 2:
                            var v2 = v;
                            if (isNaN(v2))
                                this.buf.b += "k";
                            else if (!isFinite(v2))
                                if (v2 < 0)
                                    this.buf.b += "m";
                                else
                                    this.buf.b += "p";
                            else {
                                this.buf.b += "d";
                                if (v2 == null)
                                    this.buf.b += "null";
                                else
                                    this.buf.b += "" + v2;
                            }
                            break;
                        case 3:
                            if (v)
                                this.buf.b += "t";
                            else
                                this.buf.b += "f";
                            break;
                        case 6:
                            var c = _g[2];
                            if (c == String) {
                                this.serializeString(v);
                                return;
                            }
                            if (this.useCache && this.serializeRef(v))
                                return;
                            switch (c) {
                                case Array:
                                    var ucount = 0;
                                    this.buf.b += "a";
                                    var l = v.length;
                                    var _g1 = 0;
                                    while (_g1 < l) {
                                        var i = _g1++;
                                        if (v[i] == null)
                                            ucount++;
                                        else {
                                            if (ucount > 0) {
                                                if (ucount == 1)
                                                    this.buf.b += "n";
                                                else {
                                                    this.buf.b += "u";
                                                    if (ucount == null)
                                                        this.buf.b += "null";
                                                    else
                                                        this.buf.b += "" + ucount;
                                                }
                                                ucount = 0;
                                            }
                                            this.serialize(v[i]);
                                        }
                                    }
                                    if (ucount > 0) {
                                        if (ucount == 1)
                                            this.buf.b += "n";
                                        else {
                                            this.buf.b += "u";
                                            if (ucount == null)
                                                this.buf.b += "null";
                                            else
                                                this.buf.b += "" + ucount;
                                        }
                                    }
                                    this.buf.b += "h";
                                    break;
                                case List:
                                    this.buf.b += "l";
                                    var v3 = v;
                                    var _g1_head = v3.h;
                                    var _g1_val = null;
                                    while (_g1_head != null) {
                                        var i1;
                                        _g1_val = _g1_head[0];
                                        _g1_head = _g1_head[1];
                                        i1 = _g1_val;
                                        this.serialize(i1);
                                    }
                                    this.buf.b += "h";
                                    break;
                                case Date:
                                    var d = v;
                                    this.buf.b += "v";
                                    this.buf.add(d.getTime());
                                    break;
                                case haxe_ds_StringMap:
                                    this.buf.b += "b";
                                    var v4 = v;
                                    var $it0 = v4.keys();
                                    while ($it0.hasNext()) {
                                        var k = $it0.next();
                                        this.serializeString(k);
                                        this.serialize(__map_reserved[k] != null ? v4.getReserved(k) : v4.h[k]);
                                    }
                                    this.buf.b += "h";
                                    break;
                                case haxe_ds_IntMap:
                                    this.buf.b += "q";
                                    var v5 = v;
                                    var $it1 = v5.keys();
                                    while ($it1.hasNext()) {
                                        var k1 = $it1.next();
                                        this.buf.b += ":";
                                        if (k1 == null)
                                            this.buf.b += "null";
                                        else
                                            this.buf.b += "" + k1;
                                        this.serialize(v5.h[k1]);
                                    }
                                    this.buf.b += "h";
                                    break;
                                case haxe_ds_ObjectMap:
                                    this.buf.b += "M";
                                    var v6 = v;
                                    var $it2 = v6.keys();
                                    while ($it2.hasNext()) {
                                        var k2 = $it2.next();
                                        var id = Reflect.field(k2, "__id__");
                                        Reflect.deleteField(k2, "__id__");
                                        this.serialize(k2);
                                        k2.__id__ = id;
                                        this.serialize(v6.h[k2.__id__]);
                                    }
                                    this.buf.b += "h";
                                    break;
                                case haxe_io_Bytes:
                                    var v7 = v;
                                    var i2 = 0;
                                    var max = v7.length - 2;
                                    var charsBuf = new StringBuf();
                                    var b64 = haxe_Serializer.BASE64;
                                    while (i2 < max) {
                                        var b1 = v7.get(i2++);
                                        var b2 = v7.get(i2++);
                                        var b3 = v7.get(i2++);
                                        charsBuf.add(b64.charAt(b1 >> 2));
                                        charsBuf.add(b64.charAt((b1 << 4 | b2 >> 4) & 63));
                                        charsBuf.add(b64.charAt((b2 << 2 | b3 >> 6) & 63));
                                        charsBuf.add(b64.charAt(b3 & 63));
                                    }
                                    if (i2 == max) {
                                        var b11 = v7.get(i2++);
                                        var b21 = v7.get(i2++);
                                        charsBuf.add(b64.charAt(b11 >> 2));
                                        charsBuf.add(b64.charAt((b11 << 4 | b21 >> 4) & 63));
                                        charsBuf.add(b64.charAt(b21 << 2 & 63));
                                    }
                                    else if (i2 == max + 1) {
                                        var b12 = v7.get(i2++);
                                        charsBuf.add(b64.charAt(b12 >> 2));
                                        charsBuf.add(b64.charAt(b12 << 4 & 63));
                                    }
                                    var chars = charsBuf.b;
                                    this.buf.b += "s";
                                    if (chars.length == null)
                                        this.buf.b += "null";
                                    else
                                        this.buf.b += "" + chars.length;
                                    this.buf.b += ":";
                                    if (chars == null)
                                        this.buf.b += "null";
                                    else
                                        this.buf.b += "" + chars;
                                    break;
                                default:
                                    if (this.useCache)
                                        this.cache.pop();
                                    if (v.hxSerialize != null) {
                                        this.buf.b += "C";
                                        this.serializeString(Type.getClassName(c));
                                        if (this.useCache)
                                            this.cache.push(v);
                                        v.hxSerialize(this);
                                        this.buf.b += "g";
                                    }
                                    else {
                                        this.buf.b += "c";
                                        this.serializeString(Type.getClassName(c));
                                        if (this.useCache)
                                            this.cache.push(v);
                                        this.serializeFields(v);
                                    }
                            }
                            break;
                        case 4:
                            if (js_Boot.__instanceof(v, Class)) {
                                var className = Type.getClassName(v);
                                this.buf.b += "A";
                                this.serializeString(className);
                            }
                            else if (js_Boot.__instanceof(v, Enum)) {
                                this.buf.b += "B";
                                this.serializeString(Type.getEnumName(v));
                            }
                            else {
                                if (this.useCache && this.serializeRef(v))
                                    return;
                                this.buf.b += "o";
                                this.serializeFields(v);
                            }
                            break;
                        case 7:
                            var e = _g[2];
                            if (this.useCache) {
                                if (this.serializeRef(v))
                                    return;
                                this.cache.pop();
                            }
                            if (this.useEnumIndex)
                                this.buf.b += "j";
                            else
                                this.buf.b += "w";
                            this.serializeString(Type.getEnumName(e));
                            if (this.useEnumIndex) {
                                this.buf.b += ":";
                                this.buf.b += Std.string(v[1]);
                            }
                            else
                                this.serializeString(v[0]);
                            this.buf.b += ":";
                            var l1 = v.length;
                            this.buf.b += Std.string(l1 - 2);
                            var _g11 = 2;
                            while (_g11 < l1) {
                                var i3 = _g11++;
                                this.serialize(v[i3]);
                            }
                            if (this.useCache)
                                this.cache.push(v);
                            break;
                        case 5:
                            throw new js__$Boot_HaxeError("Cannot serialize function");
                            break;
                        default:
                            throw new js__$Boot_HaxeError("Cannot serialize " + Std.string(v));
                    }
                }
            },
            __class__: haxe_Serializer
        };
        var haxe_Unserializer = function (buf) {
            this.buf = buf;
            this.length = buf.length;
            this.pos = 0;
            this.scache = [];
            this.cache = [];
            var r = haxe_Unserializer.DEFAULT_RESOLVER;
            if (r == null) {
                r = Type;
                haxe_Unserializer.DEFAULT_RESOLVER = r;
            }
            this.setResolver(r);
        };
        $hxClasses["haxe.Unserializer"] = haxe_Unserializer;
        haxe_Unserializer.__name__ = ["haxe", "Unserializer"];
        haxe_Unserializer.initCodes = function () {
            var codes = [];
            var _g1 = 0;
            var _g = haxe_Unserializer.BASE64.length;
            while (_g1 < _g) {
                var i = _g1++;
                codes[haxe_Unserializer.BASE64.charCodeAt(i)] = i;
            }
            return codes;
        };
        haxe_Unserializer.prototype = {
            setResolver: function (r) {
                if (r == null)
                    this.resolver = { resolveClass: function (_) {
                            return null;
                        }, resolveEnum: function (_1) {
                            return null;
                        } };
                else
                    this.resolver = r;
            },
            get: function (p) {
                return this.buf.charCodeAt(p);
            },
            readDigits: function () {
                var k = 0;
                var s = false;
                var fpos = this.pos;
                while (true) {
                    var c = this.buf.charCodeAt(this.pos);
                    if (c != c)
                        break;
                    if (c == 45) {
                        if (this.pos != fpos)
                            break;
                        s = true;
                        this.pos++;
                        continue;
                    }
                    if (c < 48 || c > 57)
                        break;
                    k = k * 10 + (c - 48);
                    this.pos++;
                }
                if (s)
                    k *= -1;
                return k;
            },
            readFloat: function () {
                var p1 = this.pos;
                while (true) {
                    var c = this.buf.charCodeAt(this.pos);
                    if (c >= 43 && c < 58 || c == 101 || c == 69)
                        this.pos++;
                    else
                        break;
                }
                return Std.parseFloat(HxOverrides.substr(this.buf, p1, this.pos - p1));
            },
            unserializeObject: function (o) {
                while (true) {
                    if (this.pos >= this.length)
                        throw new js__$Boot_HaxeError("Invalid object");
                    if (this.buf.charCodeAt(this.pos) == 103)
                        break;
                    var k = this.unserialize();
                    if (!(typeof (k) == "string"))
                        throw new js__$Boot_HaxeError("Invalid object key");
                    var v = this.unserialize();
                    o[k] = v;
                }
                this.pos++;
            },
            unserializeEnum: function (edecl, tag) {
                if (this.get(this.pos++) != 58)
                    throw new js__$Boot_HaxeError("Invalid enum format");
                var nargs = this.readDigits();
                if (nargs == 0)
                    return Type.createEnum(edecl, tag);
                var args = [];
                while (nargs-- > 0)
                    args.push(this.unserialize());
                return Type.createEnum(edecl, tag, args);
            },
            unserialize: function () {
                var _g = this.get(this.pos++);
                switch (_g) {
                    case 110:
                        return null;
                    case 116:
                        return true;
                    case 102:
                        return false;
                    case 122:
                        return 0;
                    case 105:
                        return this.readDigits();
                    case 100:
                        return this.readFloat();
                    case 121:
                        var len = this.readDigits();
                        if (this.get(this.pos++) != 58 || this.length - this.pos < len)
                            throw new js__$Boot_HaxeError("Invalid string length");
                        var s = HxOverrides.substr(this.buf, this.pos, len);
                        this.pos += len;
                        s = decodeURIComponent(s.split("+").join(" "));
                        this.scache.push(s);
                        return s;
                    case 107:
                        return NaN;
                    case 109:
                        return -Infinity;
                    case 112:
                        return Infinity;
                    case 97:
                        var buf = this.buf;
                        var a = [];
                        this.cache.push(a);
                        while (true) {
                            var c = this.buf.charCodeAt(this.pos);
                            if (c == 104) {
                                this.pos++;
                                break;
                            }
                            if (c == 117) {
                                this.pos++;
                                var n = this.readDigits();
                                a[a.length + n - 1] = null;
                            }
                            else
                                a.push(this.unserialize());
                        }
                        return a;
                    case 111:
                        var o = {};
                        this.cache.push(o);
                        this.unserializeObject(o);
                        return o;
                    case 114:
                        var n1 = this.readDigits();
                        if (n1 < 0 || n1 >= this.cache.length)
                            throw new js__$Boot_HaxeError("Invalid reference");
                        return this.cache[n1];
                    case 82:
                        var n2 = this.readDigits();
                        if (n2 < 0 || n2 >= this.scache.length)
                            throw new js__$Boot_HaxeError("Invalid string reference");
                        return this.scache[n2];
                    case 120:
                        throw new js__$Boot_HaxeError(this.unserialize());
                        break;
                    case 99:
                        var name = this.unserialize();
                        var cl = this.resolver.resolveClass(name);
                        if (cl == null)
                            throw new js__$Boot_HaxeError("Class not found " + name);
                        var o1 = Type.createEmptyInstance(cl);
                        this.cache.push(o1);
                        this.unserializeObject(o1);
                        return o1;
                    case 119:
                        var name1 = this.unserialize();
                        var edecl = this.resolver.resolveEnum(name1);
                        if (edecl == null)
                            throw new js__$Boot_HaxeError("Enum not found " + name1);
                        var e = this.unserializeEnum(edecl, this.unserialize());
                        this.cache.push(e);
                        return e;
                    case 106:
                        var name2 = this.unserialize();
                        var edecl1 = this.resolver.resolveEnum(name2);
                        if (edecl1 == null)
                            throw new js__$Boot_HaxeError("Enum not found " + name2);
                        this.pos++;
                        var index = this.readDigits();
                        var tag = Type.getEnumConstructs(edecl1)[index];
                        if (tag == null)
                            throw new js__$Boot_HaxeError("Unknown enum index " + name2 + "@" + index);
                        var e1 = this.unserializeEnum(edecl1, tag);
                        this.cache.push(e1);
                        return e1;
                    case 108:
                        var l = new List();
                        this.cache.push(l);
                        var buf1 = this.buf;
                        while (this.buf.charCodeAt(this.pos) != 104)
                            l.add(this.unserialize());
                        this.pos++;
                        return l;
                    case 98:
                        var h = new haxe_ds_StringMap();
                        this.cache.push(h);
                        var buf2 = this.buf;
                        while (this.buf.charCodeAt(this.pos) != 104) {
                            var s1 = this.unserialize();
                            h.set(s1, this.unserialize());
                        }
                        this.pos++;
                        return h;
                    case 113:
                        var h1 = new haxe_ds_IntMap();
                        this.cache.push(h1);
                        var buf3 = this.buf;
                        var c1 = this.get(this.pos++);
                        while (c1 == 58) {
                            var i = this.readDigits();
                            h1.set(i, this.unserialize());
                            c1 = this.get(this.pos++);
                        }
                        if (c1 != 104)
                            throw new js__$Boot_HaxeError("Invalid IntMap format");
                        return h1;
                    case 77:
                        var h2 = new haxe_ds_ObjectMap();
                        this.cache.push(h2);
                        var buf4 = this.buf;
                        while (this.buf.charCodeAt(this.pos) != 104) {
                            var s2 = this.unserialize();
                            h2.set(s2, this.unserialize());
                        }
                        this.pos++;
                        return h2;
                    case 118:
                        var d;
                        if (this.buf.charCodeAt(this.pos) >= 48 && this.buf.charCodeAt(this.pos) <= 57 && this.buf.charCodeAt(this.pos + 1) >= 48 && this.buf.charCodeAt(this.pos + 1) <= 57 && this.buf.charCodeAt(this.pos + 2) >= 48 && this.buf.charCodeAt(this.pos + 2) <= 57 && this.buf.charCodeAt(this.pos + 3) >= 48 && this.buf.charCodeAt(this.pos + 3) <= 57 && this.buf.charCodeAt(this.pos + 4) == 45) {
                            var s3 = HxOverrides.substr(this.buf, this.pos, 19);
                            d = HxOverrides.strDate(s3);
                            this.pos += 19;
                        }
                        else {
                            var t = this.readFloat();
                            var d1 = new Date();
                            d1.setTime(t);
                            d = d1;
                        }
                        this.cache.push(d);
                        return d;
                    case 115:
                        var len1 = this.readDigits();
                        var buf5 = this.buf;
                        if (this.get(this.pos++) != 58 || this.length - this.pos < len1)
                            throw new js__$Boot_HaxeError("Invalid bytes length");
                        var codes = haxe_Unserializer.CODES;
                        if (codes == null) {
                            codes = haxe_Unserializer.initCodes();
                            haxe_Unserializer.CODES = codes;
                        }
                        var i1 = this.pos;
                        var rest = len1 & 3;
                        var size;
                        size = (len1 >> 2) * 3 + (rest >= 2 ? rest - 1 : 0);
                        var max = i1 + (len1 - rest);
                        var bytes = haxe_io_Bytes.alloc(size);
                        var bpos = 0;
                        while (i1 < max) {
                            var c11 = codes[StringTools.fastCodeAt(buf5, i1++)];
                            var c2 = codes[StringTools.fastCodeAt(buf5, i1++)];
                            bytes.set(bpos++, c11 << 2 | c2 >> 4);
                            var c3 = codes[StringTools.fastCodeAt(buf5, i1++)];
                            bytes.set(bpos++, c2 << 4 | c3 >> 2);
                            var c4 = codes[StringTools.fastCodeAt(buf5, i1++)];
                            bytes.set(bpos++, c3 << 6 | c4);
                        }
                        if (rest >= 2) {
                            var c12 = codes[StringTools.fastCodeAt(buf5, i1++)];
                            var c21 = codes[StringTools.fastCodeAt(buf5, i1++)];
                            bytes.set(bpos++, c12 << 2 | c21 >> 4);
                            if (rest == 3) {
                                var c31 = codes[StringTools.fastCodeAt(buf5, i1++)];
                                bytes.set(bpos++, c21 << 4 | c31 >> 2);
                            }
                        }
                        this.pos += len1;
                        this.cache.push(bytes);
                        return bytes;
                    case 67:
                        var name3 = this.unserialize();
                        var cl1 = this.resolver.resolveClass(name3);
                        if (cl1 == null)
                            throw new js__$Boot_HaxeError("Class not found " + name3);
                        var o2 = Type.createEmptyInstance(cl1);
                        this.cache.push(o2);
                        o2.hxUnserialize(this);
                        if (this.get(this.pos++) != 103)
                            throw new js__$Boot_HaxeError("Invalid custom data");
                        return o2;
                    case 65:
                        var name4 = this.unserialize();
                        var cl2 = this.resolver.resolveClass(name4);
                        if (cl2 == null)
                            throw new js__$Boot_HaxeError("Class not found " + name4);
                        return cl2;
                    case 66:
                        var name5 = this.unserialize();
                        var e2 = this.resolver.resolveEnum(name5);
                        if (e2 == null)
                            throw new js__$Boot_HaxeError("Enum not found " + name5);
                        return e2;
                    default:
                }
                this.pos--;
                throw new js__$Boot_HaxeError("Invalid char " + this.buf.charAt(this.pos) + " at position " + this.pos);
            },
            __class__: haxe_Unserializer
        };
        var haxe_ds_IntMap = function () {
            this.h = {};
        };
        $hxClasses["haxe.ds.IntMap"] = haxe_ds_IntMap;
        haxe_ds_IntMap.__name__ = ["haxe", "ds", "IntMap"];
        haxe_ds_IntMap.__interfaces__ = [haxe_IMap];
        haxe_ds_IntMap.prototype = {
            set: function (key, value) {
                this.h[key] = value;
            },
            remove: function (key) {
                if (!this.h.hasOwnProperty(key))
                    return false;
                delete (this.h[key]);
                return true;
            },
            keys: function () {
                var a = [];
                for (var key in this.h) {
                    if (this.h.hasOwnProperty(key))
                        a.push(key | 0);
                }
                return HxOverrides.iter(a);
            },
            __class__: haxe_ds_IntMap
        };
        var haxe_ds_ObjectMap = function () {
            this.h = {};
            this.h.__keys__ = {};
        };
        $hxClasses["haxe.ds.ObjectMap"] = haxe_ds_ObjectMap;
        haxe_ds_ObjectMap.__name__ = ["haxe", "ds", "ObjectMap"];
        haxe_ds_ObjectMap.__interfaces__ = [haxe_IMap];
        haxe_ds_ObjectMap.prototype = {
            set: function (key, value) {
                var id = key.__id__ || (key.__id__ = ++haxe_ds_ObjectMap.count);
                this.h[id] = value;
                this.h.__keys__[id] = key;
            },
            keys: function () {
                var a = [];
                for (var key in this.h.__keys__) {
                    if (this.h.hasOwnProperty(key))
                        a.push(this.h.__keys__[key]);
                }
                return HxOverrides.iter(a);
            },
            __class__: haxe_ds_ObjectMap
        };
        var haxe_ds_Option = $hxClasses["haxe.ds.Option"] = { __ename__: ["haxe", "ds", "Option"], __constructs__: ["Some", "None"] };
        haxe_ds_Option.Some = function (v) { var $x = ["Some", 0, v]; $x.__enum__ = haxe_ds_Option; $x.toString = $estr; return $x; };
        haxe_ds_Option.None = ["None", 1];
        haxe_ds_Option.None.toString = $estr;
        haxe_ds_Option.None.__enum__ = haxe_ds_Option;
        var haxe_ds_StringMap = function () {
            this.h = {};
        };
        $hxClasses["haxe.ds.StringMap"] = haxe_ds_StringMap;
        haxe_ds_StringMap.__name__ = ["haxe", "ds", "StringMap"];
        haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
        haxe_ds_StringMap.prototype = {
            set: function (key, value) {
                if (__map_reserved[key] != null)
                    this.setReserved(key, value);
                else
                    this.h[key] = value;
            },
            get: function (key) {
                if (__map_reserved[key] != null)
                    return this.getReserved(key);
                return this.h[key];
            },
            setReserved: function (key, value) {
                if (this.rh == null)
                    this.rh = {};
                this.rh["$" + key] = value;
            },
            getReserved: function (key) {
                if (this.rh == null)
                    return null;
                else
                    return this.rh["$" + key];
            },
            keys: function () {
                var _this = this.arrayKeys();
                return HxOverrides.iter(_this);
            },
            arrayKeys: function () {
                var out = [];
                for (var key in this.h) {
                    if (this.h.hasOwnProperty(key))
                        out.push(key);
                }
                if (this.rh != null) {
                    for (var key in this.rh) {
                        if (key.charCodeAt(0) == 36)
                            out.push(key.substr(1));
                    }
                }
                return out;
            },
            __class__: haxe_ds_StringMap
        };
        var haxe_io_Bytes = function (data) {
            this.length = data.byteLength;
            this.b = new Uint8Array(data);
            this.b.bufferValue = data;
            data.hxBytes = this;
            data.bytes = this.b;
        };
        $hxClasses["haxe.io.Bytes"] = haxe_io_Bytes;
        haxe_io_Bytes.__name__ = ["haxe", "io", "Bytes"];
        haxe_io_Bytes.alloc = function (length) {
            return new haxe_io_Bytes(new ArrayBuffer(length));
        };
        haxe_io_Bytes.prototype = {
            get: function (pos) {
                return this.b[pos];
            },
            set: function (pos, v) {
                this.b[pos] = v & 255;
            },
            __class__: haxe_io_Bytes
        };
        var haxe_io_Error = $hxClasses["haxe.io.Error"] = { __ename__: ["haxe", "io", "Error"], __constructs__: ["Blocked", "Overflow", "OutsideBounds", "Custom"] };
        haxe_io_Error.Blocked = ["Blocked", 0];
        haxe_io_Error.Blocked.toString = $estr;
        haxe_io_Error.Blocked.__enum__ = haxe_io_Error;
        haxe_io_Error.Overflow = ["Overflow", 1];
        haxe_io_Error.Overflow.toString = $estr;
        haxe_io_Error.Overflow.__enum__ = haxe_io_Error;
        haxe_io_Error.OutsideBounds = ["OutsideBounds", 2];
        haxe_io_Error.OutsideBounds.toString = $estr;
        haxe_io_Error.OutsideBounds.__enum__ = haxe_io_Error;
        haxe_io_Error.Custom = function (e) { var $x = ["Custom", 3, e]; $x.__enum__ = haxe_io_Error; $x.toString = $estr; return $x; };
        var haxe_io_FPHelper = function () { };
        $hxClasses["haxe.io.FPHelper"] = haxe_io_FPHelper;
        haxe_io_FPHelper.__name__ = ["haxe", "io", "FPHelper"];
        haxe_io_FPHelper.i32ToFloat = function (i) {
            var sign = 1 - (i >>> 31 << 1);
            var exp = i >>> 23 & 255;
            var sig = i & 8388607;
            if (sig == 0 && exp == 0)
                return 0.0;
            return sign * (1 + Math.pow(2, -23) * sig) * Math.pow(2, exp - 127);
        };
        haxe_io_FPHelper.floatToI32 = function (f) {
            if (f == 0)
                return 0;
            var af;
            if (f < 0)
                af = -f;
            else
                af = f;
            var exp = Math.floor(Math.log(af) / 0.6931471805599453);
            if (exp < -127)
                exp = -127;
            else if (exp > 128)
                exp = 128;
            var sig = Math.round((af / Math.pow(2, exp) - 1) * 8388608) & 8388607;
            return (f < 0 ? -2147483648 : 0) | exp + 127 << 23 | sig;
        };
        haxe_io_FPHelper.i64ToDouble = function (low, high) {
            var sign = 1 - (high >>> 31 << 1);
            var exp = (high >> 20 & 2047) - 1023;
            var sig = (high & 1048575) * 4294967296. + (low >>> 31) * 2147483648. + (low & 2147483647);
            if (sig == 0 && exp == -1023)
                return 0.0;
            return sign * (1.0 + Math.pow(2, -52) * sig) * Math.pow(2, exp);
        };
        haxe_io_FPHelper.doubleToI64 = function (v) {
            var i64 = haxe_io_FPHelper.i64tmp;
            if (v == 0) {
                i64.low = 0;
                i64.high = 0;
            }
            else {
                var av;
                if (v < 0)
                    av = -v;
                else
                    av = v;
                var exp = Math.floor(Math.log(av) / 0.6931471805599453);
                var sig;
                var v1 = (av / Math.pow(2, exp) - 1) * 4503599627370496.;
                sig = Math.round(v1);
                var sig_l = sig | 0;
                var sig_h = sig / 4294967296.0 | 0;
                i64.low = sig_l;
                i64.high = (v < 0 ? -2147483648 : 0) | exp + 1023 << 20 | sig_h;
            }
            return i64;
        };
        var js__$Boot_HaxeError = function (val) {
            Error.call(this);
            this.val = val;
            this.message = String(val);
            if (Error.captureStackTrace)
                Error.captureStackTrace(this, js__$Boot_HaxeError);
        };
        $hxClasses["js._Boot.HaxeError"] = js__$Boot_HaxeError;
        js__$Boot_HaxeError.__name__ = ["js", "_Boot", "HaxeError"];
        js__$Boot_HaxeError.__super__ = Error;
        js__$Boot_HaxeError.prototype = $extend(Error.prototype, {
            __class__: js__$Boot_HaxeError
        });
        var js_Boot = function () { };
        $hxClasses["js.Boot"] = js_Boot;
        js_Boot.__name__ = ["js", "Boot"];
        js_Boot.getClass = function (o) {
            if ((o instanceof Array) && o.__enum__ == null)
                return Array;
            else {
                var cl = o.__class__;
                if (cl != null)
                    return cl;
                var name = js_Boot.__nativeClassName(o);
                if (name != null)
                    return js_Boot.__resolveNativeClass(name);
                return null;
            }
        };
        js_Boot.__string_rec = function (o, s) {
            if (o == null)
                return "null";
            if (s.length >= 5)
                return "<...>";
            var t = typeof (o);
            if (t == "function" && (o.__name__ || o.__ename__))
                t = "object";
            switch (t) {
                case "object":
                    if (o instanceof Array) {
                        if (o.__enum__) {
                            if (o.length == 2)
                                return o[0];
                            var str2 = o[0] + "(";
                            s += "\t";
                            var _g1 = 2;
                            var _g = o.length;
                            while (_g1 < _g) {
                                var i1 = _g1++;
                                if (i1 != 2)
                                    str2 += "," + js_Boot.__string_rec(o[i1], s);
                                else
                                    str2 += js_Boot.__string_rec(o[i1], s);
                            }
                            return str2 + ")";
                        }
                        var l = o.length;
                        var i;
                        var str1 = "[";
                        s += "\t";
                        var _g2 = 0;
                        while (_g2 < l) {
                            var i2 = _g2++;
                            str1 += (i2 > 0 ? "," : "") + js_Boot.__string_rec(o[i2], s);
                        }
                        str1 += "]";
                        return str1;
                    }
                    var tostr;
                    try {
                        tostr = o.toString;
                    }
                    catch (e) {
                        if (e instanceof js__$Boot_HaxeError)
                            e = e.val;
                        return "???";
                    }
                    if (tostr != null && tostr != Object.toString && typeof (tostr) == "function") {
                        var s2 = o.toString();
                        if (s2 != "[object Object]")
                            return s2;
                    }
                    var k = null;
                    var str = "{\n";
                    s += "\t";
                    var hasp = o.hasOwnProperty != null;
                    for (var k in o) {
                        if (hasp && !o.hasOwnProperty(k)) {
                            continue;
                        }
                        if (k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
                            continue;
                        }
                        if (str.length != 2)
                            str += ", \n";
                        str += s + k + " : " + js_Boot.__string_rec(o[k], s);
                    }
                    s = s.substring(1);
                    str += "\n" + s + "}";
                    return str;
                case "function":
                    return "<function>";
                case "string":
                    return o;
                default:
                    return String(o);
            }
        };
        js_Boot.__interfLoop = function (cc, cl) {
            if (cc == null)
                return false;
            if (cc == cl)
                return true;
            var intf = cc.__interfaces__;
            if (intf != null) {
                var _g1 = 0;
                var _g = intf.length;
                while (_g1 < _g) {
                    var i = _g1++;
                    var i1 = intf[i];
                    if (i1 == cl || js_Boot.__interfLoop(i1, cl))
                        return true;
                }
            }
            return js_Boot.__interfLoop(cc.__super__, cl);
        };
        js_Boot.__instanceof = function (o, cl) {
            if (cl == null)
                return false;
            switch (cl) {
                case Int:
                    return (o | 0) === o;
                case Float:
                    return typeof (o) == "number";
                case Bool:
                    return typeof (o) == "boolean";
                case String:
                    return typeof (o) == "string";
                case Array:
                    return (o instanceof Array) && o.__enum__ == null;
                case Dynamic:
                    return true;
                default:
                    if (o != null) {
                        if (typeof (cl) == "function") {
                            if (o instanceof cl)
                                return true;
                            if (js_Boot.__interfLoop(js_Boot.getClass(o), cl))
                                return true;
                        }
                        else if (typeof (cl) == "object" && js_Boot.__isNativeObj(cl)) {
                            if (o instanceof cl)
                                return true;
                        }
                    }
                    else
                        return false;
                    if (cl == Class && o.__name__ != null)
                        return true;
                    if (cl == Enum && o.__ename__ != null)
                        return true;
                    return o.__enum__ == cl;
            }
        };
        js_Boot.__nativeClassName = function (o) {
            var name = js_Boot.__toStr.call(o).slice(8, -1);
            if (name == "Object" || name == "Function" || name == "Math" || name == "JSON")
                return null;
            return name;
        };
        js_Boot.__isNativeObj = function (o) {
            return js_Boot.__nativeClassName(o) != null;
        };
        js_Boot.__resolveNativeClass = function (name) {
            return $global[name];
        };
        var js_html_compat_ArrayBuffer = function (a) {
            if ((a instanceof Array) && a.__enum__ == null) {
                this.a = a;
                this.byteLength = a.length;
            }
            else {
                var len = a;
                this.a = [];
                var _g = 0;
                while (_g < len) {
                    var i = _g++;
                    this.a[i] = 0;
                }
                this.byteLength = len;
            }
        };
        $hxClasses["js.html.compat.ArrayBuffer"] = js_html_compat_ArrayBuffer;
        js_html_compat_ArrayBuffer.__name__ = ["js", "html", "compat", "ArrayBuffer"];
        js_html_compat_ArrayBuffer.sliceImpl = function (begin, end) {
            var u = new Uint8Array(this, begin, end == null ? null : end - begin);
            var result = new ArrayBuffer(u.byteLength);
            var resultArray = new Uint8Array(result);
            resultArray.set(u);
            return result;
        };
        js_html_compat_ArrayBuffer.prototype = {
            slice: function (begin, end) {
                return new js_html_compat_ArrayBuffer(this.a.slice(begin, end));
            },
            __class__: js_html_compat_ArrayBuffer
        };
        var js_html_compat_DataView = function (buffer, byteOffset, byteLength) {
            this.buf = buffer;
            if (byteOffset == null)
                this.offset = 0;
            else
                this.offset = byteOffset;
            if (byteLength == null)
                this.length = buffer.byteLength - this.offset;
            else
                this.length = byteLength;
            if (this.offset < 0 || this.length < 0 || this.offset + this.length > buffer.byteLength)
                throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
        };
        $hxClasses["js.html.compat.DataView"] = js_html_compat_DataView;
        js_html_compat_DataView.__name__ = ["js", "html", "compat", "DataView"];
        js_html_compat_DataView.prototype = {
            getInt8: function (byteOffset) {
                var v = this.buf.a[this.offset + byteOffset];
                if (v >= 128)
                    return v - 256;
                else
                    return v;
            },
            getUint8: function (byteOffset) {
                return this.buf.a[this.offset + byteOffset];
            },
            getInt16: function (byteOffset, littleEndian) {
                var v = this.getUint16(byteOffset, littleEndian);
                if (v >= 32768)
                    return v - 65536;
                else
                    return v;
            },
            getUint16: function (byteOffset, littleEndian) {
                if (littleEndian)
                    return this.buf.a[this.offset + byteOffset] | this.buf.a[this.offset + byteOffset + 1] << 8;
                else
                    return this.buf.a[this.offset + byteOffset] << 8 | this.buf.a[this.offset + byteOffset + 1];
            },
            getInt32: function (byteOffset, littleEndian) {
                var p = this.offset + byteOffset;
                var a = this.buf.a[p++];
                var b = this.buf.a[p++];
                var c = this.buf.a[p++];
                var d = this.buf.a[p++];
                if (littleEndian)
                    return a | b << 8 | c << 16 | d << 24;
                else
                    return d | c << 8 | b << 16 | a << 24;
            },
            getUint32: function (byteOffset, littleEndian) {
                var v = this.getInt32(byteOffset, littleEndian);
                if (v < 0)
                    return v + 4294967296.;
                else
                    return v;
            },
            getFloat32: function (byteOffset, littleEndian) {
                return haxe_io_FPHelper.i32ToFloat(this.getInt32(byteOffset, littleEndian));
            },
            getFloat64: function (byteOffset, littleEndian) {
                var a = this.getInt32(byteOffset, littleEndian);
                var b = this.getInt32(byteOffset + 4, littleEndian);
                return haxe_io_FPHelper.i64ToDouble(littleEndian ? a : b, littleEndian ? b : a);
            },
            setInt8: function (byteOffset, value) {
                if (value < 0)
                    this.buf.a[byteOffset + this.offset] = value + 128 & 255;
                else
                    this.buf.a[byteOffset + this.offset] = value & 255;
            },
            setUint8: function (byteOffset, value) {
                this.buf.a[byteOffset + this.offset] = value & 255;
            },
            setInt16: function (byteOffset, value, littleEndian) {
                this.setUint16(byteOffset, value < 0 ? value + 65536 : value, littleEndian);
            },
            setUint16: function (byteOffset, value, littleEndian) {
                var p = byteOffset + this.offset;
                if (littleEndian) {
                    this.buf.a[p] = value & 255;
                    this.buf.a[p++] = value >> 8 & 255;
                }
                else {
                    this.buf.a[p++] = value >> 8 & 255;
                    this.buf.a[p] = value & 255;
                }
            },
            setInt32: function (byteOffset, value, littleEndian) {
                this.setUint32(byteOffset, value, littleEndian);
            },
            setUint32: function (byteOffset, value, littleEndian) {
                var p = byteOffset + this.offset;
                if (littleEndian) {
                    this.buf.a[p++] = value & 255;
                    this.buf.a[p++] = value >> 8 & 255;
                    this.buf.a[p++] = value >> 16 & 255;
                    this.buf.a[p++] = value >>> 24;
                }
                else {
                    this.buf.a[p++] = value >>> 24;
                    this.buf.a[p++] = value >> 16 & 255;
                    this.buf.a[p++] = value >> 8 & 255;
                    this.buf.a[p++] = value & 255;
                }
            },
            setFloat32: function (byteOffset, value, littleEndian) {
                this.setUint32(byteOffset, haxe_io_FPHelper.floatToI32(value), littleEndian);
            },
            setFloat64: function (byteOffset, value, littleEndian) {
                var i64 = haxe_io_FPHelper.doubleToI64(value);
                if (littleEndian) {
                    this.setUint32(byteOffset, i64.low);
                    this.setUint32(byteOffset, i64.high);
                }
                else {
                    this.setUint32(byteOffset, i64.high);
                    this.setUint32(byteOffset, i64.low);
                }
            },
            __class__: js_html_compat_DataView
        };
        var js_html_compat_Uint8Array = function () { };
        $hxClasses["js.html.compat.Uint8Array"] = js_html_compat_Uint8Array;
        js_html_compat_Uint8Array.__name__ = ["js", "html", "compat", "Uint8Array"];
        js_html_compat_Uint8Array._new = function (arg1, offset, length) {
            var arr;
            if (typeof (arg1) == "number") {
                arr = [];
                var _g = 0;
                while (_g < arg1) {
                    var i = _g++;
                    arr[i] = 0;
                }
                arr.byteLength = arr.length;
                arr.byteOffset = 0;
                arr.buffer = new js_html_compat_ArrayBuffer(arr);
            }
            else if (js_Boot.__instanceof(arg1, js_html_compat_ArrayBuffer)) {
                var buffer = arg1;
                if (offset == null)
                    offset = 0;
                if (length == null)
                    length = buffer.byteLength - offset;
                if (offset == 0)
                    arr = buffer.a;
                else
                    arr = buffer.a.slice(offset, offset + length);
                arr.byteLength = arr.length;
                arr.byteOffset = offset;
                arr.buffer = buffer;
            }
            else if ((arg1 instanceof Array) && arg1.__enum__ == null) {
                arr = arg1.slice();
                arr.byteLength = arr.length;
                arr.byteOffset = 0;
                arr.buffer = new js_html_compat_ArrayBuffer(arr);
            }
            else
                throw new js__$Boot_HaxeError("TODO " + Std.string(arg1));
            arr.subarray = js_html_compat_Uint8Array._subarray;
            arr.set = js_html_compat_Uint8Array._set;
            return arr;
        };
        js_html_compat_Uint8Array._set = function (arg, offset) {
            var t = this;
            if (js_Boot.__instanceof(arg.buffer, js_html_compat_ArrayBuffer)) {
                var a = arg;
                if (arg.byteLength + offset > t.byteLength)
                    throw new js__$Boot_HaxeError("set() outside of range");
                var _g1 = 0;
                var _g = arg.byteLength;
                while (_g1 < _g) {
                    var i = _g1++;
                    t[i + offset] = a[i];
                }
            }
            else if ((arg instanceof Array) && arg.__enum__ == null) {
                var a1 = arg;
                if (a1.length + offset > t.byteLength)
                    throw new js__$Boot_HaxeError("set() outside of range");
                var _g11 = 0;
                var _g2 = a1.length;
                while (_g11 < _g2) {
                    var i1 = _g11++;
                    t[i1 + offset] = a1[i1];
                }
            }
            else
                throw new js__$Boot_HaxeError("TODO");
        };
        js_html_compat_Uint8Array._subarray = function (start, end) {
            var t = this;
            var a = js_html_compat_Uint8Array._new(t.slice(start, end));
            a.byteOffset = start;
            return a;
        };
        var promhx_base_AsyncBase = function (d) {
            this._resolved = false;
            this._pending = false;
            this._errorPending = false;
            this._fulfilled = false;
            this._update = [];
            this._error = [];
            this._errored = false;
            if (d != null)
                promhx_base_AsyncBase.link(d, this, function (x) {
                    return x;
                });
        };
        $hxClasses["promhx.base.AsyncBase"] = promhx_base_AsyncBase;
        promhx_base_AsyncBase.__name__ = ["promhx", "base", "AsyncBase"];
        promhx_base_AsyncBase.link = function (current, next, f) {
            current._update.push({ async: next, linkf: function (x) {
                    next.handleResolve(f(x));
                } });
            promhx_base_AsyncBase.immediateLinkUpdate(current, next, f);
        };
        promhx_base_AsyncBase.immediateLinkUpdate = function (current, next, f) {
            if (current._errored && !current._errorPending && !(current._error.length > 0))
                next.handleError(current._errorVal);
            if (current._resolved && !current._pending)
                try {
                    next.handleResolve(f(current._val));
                }
                catch (e) {
                    if (e instanceof js__$Boot_HaxeError)
                        e = e.val;
                    next.handleError(e);
                }
        };
        promhx_base_AsyncBase.linkAll = function (all, next) {
            var cthen = function (arr, current, v) {
                if (arr.length == 0 || promhx_base_AsyncBase.allFulfilled(arr)) {
                    var vals;
                    var _g = [];
                    var $it0 = $iterator(all)();
                    while ($it0.hasNext()) {
                        var a = $it0.next();
                        _g.push(a == current ? v : a._val);
                    }
                    vals = _g;
                    next.handleResolve(vals);
                }
                null;
                return;
            };
            var $it1 = $iterator(all)();
            while ($it1.hasNext()) {
                var a1 = $it1.next();
                a1._update.push({ async: next, linkf: (function (f, a11, a2) {
                        return function (v1) {
                            f(a11, a2, v1);
                            return;
                        };
                    })(cthen, (function ($this) {
                        var $r;
                        var _g1 = [];
                        var $it2 = $iterator(all)();
                        while ($it2.hasNext()) {
                            var a21 = $it2.next();
                            if (a21 != a1)
                                _g1.push(a21);
                        }
                        $r = _g1;
                        return $r;
                    }(this)), a1) });
            }
            if (promhx_base_AsyncBase.allFulfilled(all))
                next.handleResolve((function ($this) {
                    var $r;
                    var _g2 = [];
                    var $it3 = $iterator(all)();
                    while ($it3.hasNext()) {
                        var a3 = $it3.next();
                        _g2.push(a3._val);
                    }
                    $r = _g2;
                    return $r;
                }(this)));
        };
        promhx_base_AsyncBase.pipeLink = function (current, ret, f) {
            var linked = false;
            var linkf = function (x) {
                if (!linked) {
                    linked = true;
                    var pipe_ret = f(x);
                    pipe_ret._update.push({ async: ret, linkf: $bind(ret, ret.handleResolve) });
                    promhx_base_AsyncBase.immediateLinkUpdate(pipe_ret, ret, function (x1) {
                        return x1;
                    });
                }
            };
            current._update.push({ async: ret, linkf: linkf });
            if (current._resolved && !current._pending)
                try {
                    linkf(current._val);
                }
                catch (e) {
                    if (e instanceof js__$Boot_HaxeError)
                        e = e.val;
                    ret.handleError(e);
                }
        };
        promhx_base_AsyncBase.allResolved = function ($as) {
            var $it0 = $iterator($as)();
            while ($it0.hasNext()) {
                var a = $it0.next();
                if (!a._resolved)
                    return false;
            }
            return true;
        };
        promhx_base_AsyncBase.allFulfilled = function ($as) {
            var $it0 = $iterator($as)();
            while ($it0.hasNext()) {
                var a = $it0.next();
                if (!a._fulfilled)
                    return false;
            }
            return true;
        };
        promhx_base_AsyncBase.prototype = {
            catchError: function (f) {
                this._error.push(f);
                return this;
            },
            errorThen: function (f) {
                this._errorMap = f;
                return this;
            },
            isResolved: function () {
                return this._resolved;
            },
            isErrored: function () {
                return this._errored;
            },
            isErrorHandled: function () {
                return this._error.length > 0;
            },
            isErrorPending: function () {
                return this._errorPending;
            },
            isFulfilled: function () {
                return this._fulfilled;
            },
            isPending: function () {
                return this._pending;
            },
            handleResolve: function (val) {
                this._resolve(val);
            },
            _resolve: function (val) {
                var _g = this;
                if (this._pending)
                    promhx_base_EventLoop.enqueue((function (f, a1) {
                        return function () {
                            f(a1);
                        };
                    })($bind(this, this._resolve), val));
                else {
                    this._resolved = true;
                    this._pending = true;
                    promhx_base_EventLoop.queue.add(function () {
                        _g._val = val;
                        var _g1 = 0;
                        var _g2 = _g._update;
                        while (_g1 < _g2.length) {
                            var up = _g2[_g1];
                            ++_g1;
                            try {
                                up.linkf(val);
                            }
                            catch (e) {
                                if (e instanceof js__$Boot_HaxeError)
                                    e = e.val;
                                up.async.handleError(e);
                            }
                        }
                        _g._fulfilled = true;
                        _g._pending = false;
                    });
                    promhx_base_EventLoop.continueOnNextLoop();
                }
            },
            handleError: function (error) {
                this._handleError(error);
            },
            _handleError: function (error) {
                var _g = this;
                var update_errors = function (e) {
                    if (_g._error.length > 0) {
                        var _g1 = 0;
                        var _g2 = _g._error;
                        while (_g1 < _g2.length) {
                            var ef = _g2[_g1];
                            ++_g1;
                            ef(e);
                        }
                    }
                    else if (_g._update.length > 0) {
                        var _g11 = 0;
                        var _g21 = _g._update;
                        while (_g11 < _g21.length) {
                            var up = _g21[_g11];
                            ++_g11;
                            up.async.handleError(e);
                        }
                    }
                    else
                        throw new js__$Boot_HaxeError(e);
                    _g._errorPending = false;
                };
                if (!this._errorPending) {
                    this._errorPending = true;
                    this._errored = true;
                    this._errorVal = error;
                    promhx_base_EventLoop.queue.add(function () {
                        if (_g._errorMap != null)
                            try {
                                _g._resolve(_g._errorMap(error));
                            }
                            catch (e1) {
                                if (e1 instanceof js__$Boot_HaxeError)
                                    e1 = e1.val;
                                update_errors(e1);
                            }
                        else
                            update_errors(error);
                    });
                    promhx_base_EventLoop.continueOnNextLoop();
                }
            },
            then: function (f) {
                var ret = new promhx_base_AsyncBase(null);
                promhx_base_AsyncBase.link(this, ret, f);
                return ret;
            },
            unlink: function (to) {
                var _g = this;
                promhx_base_EventLoop.queue.add(function () {
                    _g._update = _g._update.filter(function (x) {
                        return x.async != to;
                    });
                });
                promhx_base_EventLoop.continueOnNextLoop();
            },
            isLinked: function (to) {
                var updated = false;
                var _g = 0;
                var _g1 = this._update;
                while (_g < _g1.length) {
                    var u = _g1[_g];
                    ++_g;
                    if (u.async == to)
                        return true;
                }
                return updated;
            },
            __class__: promhx_base_AsyncBase
        };
        var promhx_Deferred = $hx_exports.promhx.Deferred = function () {
            promhx_base_AsyncBase.call(this);
        };
        $hxClasses["promhx.Deferred"] = promhx_Deferred;
        promhx_Deferred.__name__ = ["promhx", "Deferred"];
        promhx_Deferred.__super__ = promhx_base_AsyncBase;
        promhx_Deferred.prototype = $extend(promhx_base_AsyncBase.prototype, {
            resolve: function (val) {
                this.handleResolve(val);
            },
            throwError: function (e) {
                this.handleError(e);
            },
            promise: function () {
                return new promhx_Promise(this);
            },
            stream: function () {
                return new promhx_Stream(this);
            },
            publicStream: function () {
                return new promhx_PublicStream(this);
            },
            __class__: promhx_Deferred
        });
        var promhx_Promise = $hx_exports.promhx.Promise = function (d) {
            promhx_base_AsyncBase.call(this, d);
            this._rejected = false;
        };
        $hxClasses["promhx.Promise"] = promhx_Promise;
        promhx_Promise.__name__ = ["promhx", "Promise"];
        promhx_Promise.whenAll = function (itb) {
            var ret = new promhx_Promise(null);
            promhx_base_AsyncBase.linkAll(itb, ret);
            return ret;
        };
        promhx_Promise.promise = function (_val) {
            var ret = new promhx_Promise();
            ret.handleResolve(_val);
            return ret;
        };
        promhx_Promise.__super__ = promhx_base_AsyncBase;
        promhx_Promise.prototype = $extend(promhx_base_AsyncBase.prototype, {
            isRejected: function () {
                return this._rejected;
            },
            reject: function (e) {
                this._rejected = true;
                this.handleError(e);
            },
            handleResolve: function (val) {
                if (this._resolved) {
                    var msg = "Promise has already been resolved";
                    throw new js__$Boot_HaxeError(promhx_error_PromiseError.AlreadyResolved(msg));
                }
                this._resolve(val);
            },
            then: function (f) {
                var ret = new promhx_Promise(null);
                promhx_base_AsyncBase.link(this, ret, f);
                return ret;
            },
            unlink: function (to) {
                var _g = this;
                promhx_base_EventLoop.queue.add(function () {
                    if (!_g._fulfilled) {
                        var msg = "Downstream Promise is not fullfilled";
                        _g.handleError(promhx_error_PromiseError.DownstreamNotFullfilled(msg));
                    }
                    else
                        _g._update = _g._update.filter(function (x) {
                            return x.async != to;
                        });
                });
                promhx_base_EventLoop.continueOnNextLoop();
            },
            handleError: function (error) {
                this._rejected = true;
                this._handleError(error);
            },
            pipe: function (f) {
                var ret = new promhx_Promise(null);
                promhx_base_AsyncBase.pipeLink(this, ret, f);
                return ret;
            },
            errorPipe: function (f) {
                var ret = new promhx_Promise();
                this.catchError(function (e) {
                    var piped = f(e);
                    piped.then($bind(ret, ret._resolve));
                });
                this.then($bind(ret, ret._resolve));
                return ret;
            },
            __class__: promhx_Promise
        });
        var promhx_Stream = $hx_exports.promhx.Stream = function (d) {
            promhx_base_AsyncBase.call(this, d);
            this._end_promise = new promhx_Promise();
        };
        $hxClasses["promhx.Stream"] = promhx_Stream;
        promhx_Stream.__name__ = ["promhx", "Stream"];
        promhx_Stream.foreach = function (itb) {
            var s = new promhx_Stream(null);
            var $it0 = $iterator(itb)();
            while ($it0.hasNext()) {
                var i = $it0.next();
                s.handleResolve(i);
            }
            s.end();
            return s;
        };
        promhx_Stream.wheneverAll = function (itb) {
            var ret = new promhx_Stream(null);
            promhx_base_AsyncBase.linkAll(itb, ret);
            return ret;
        };
        promhx_Stream.concatAll = function (itb) {
            var ret = new promhx_Stream(null);
            var $it0 = $iterator(itb)();
            while ($it0.hasNext()) {
                var i = $it0.next();
                ret.concat(i);
            }
            return ret;
        };
        promhx_Stream.mergeAll = function (itb) {
            var ret = new promhx_Stream(null);
            var $it0 = $iterator(itb)();
            while ($it0.hasNext()) {
                var i = $it0.next();
                ret.merge(i);
            }
            return ret;
        };
        promhx_Stream.stream = function (_val) {
            var ret = new promhx_Stream(null);
            ret.handleResolve(_val);
            return ret;
        };
        promhx_Stream.__super__ = promhx_base_AsyncBase;
        promhx_Stream.prototype = $extend(promhx_base_AsyncBase.prototype, {
            then: function (f) {
                var ret = new promhx_Stream(null);
                promhx_base_AsyncBase.link(this, ret, f);
                this._end_promise._update.push({ async: ret._end_promise, linkf: function (x) {
                        ret.end();
                    } });
                return ret;
            },
            detachStream: function (str) {
                var filtered = [];
                var removed = false;
                var _g = 0;
                var _g1 = this._update;
                while (_g < _g1.length) {
                    var u = _g1[_g];
                    ++_g;
                    if (u.async == str) {
                        this._end_promise._update = this._end_promise._update.filter(function (x) {
                            return x.async != str._end_promise;
                        });
                        removed = true;
                    }
                    else
                        filtered.push(u);
                }
                this._update = filtered;
                return removed;
            },
            first: function () {
                var s = new promhx_Promise(null);
                this.then(function (x) {
                    if (!s._resolved)
                        s.handleResolve(x);
                });
                return s;
            },
            handleResolve: function (val) {
                if (!this._end && !this._pause)
                    this._resolve(val);
            },
            pause: function (set) {
                if (set == null)
                    set = !this._pause;
                this._pause = set;
            },
            pipe: function (f) {
                var ret = new promhx_Stream(null);
                promhx_base_AsyncBase.pipeLink(this, ret, f);
                this._end_promise.then(function (x) {
                    ret.end();
                });
                return ret;
            },
            errorPipe: function (f) {
                var ret = new promhx_Stream(null);
                this.catchError(function (e) {
                    var piped = f(e);
                    piped.then($bind(ret, ret._resolve));
                    piped._end_promise.then(($_ = ret._end_promise, $bind($_, $_._resolve)));
                });
                this.then($bind(ret, ret._resolve));
                this._end_promise.then(function (x) {
                    ret.end();
                });
                return ret;
            },
            handleEnd: function () {
                if (this._pending) {
                    promhx_base_EventLoop.queue.add($bind(this, this.handleEnd));
                    promhx_base_EventLoop.continueOnNextLoop();
                }
                else if (this._end_promise._resolved)
                    return;
                else {
                    this._end = true;
                    var o;
                    if (this._resolved)
                        o = haxe_ds_Option.Some(this._val);
                    else
                        o = haxe_ds_Option.None;
                    this._end_promise.handleResolve(o);
                    this._update = [];
                    this._error = [];
                }
            },
            end: function () {
                promhx_base_EventLoop.queue.add($bind(this, this.handleEnd));
                promhx_base_EventLoop.continueOnNextLoop();
                return this;
            },
            endThen: function (f) {
                return this._end_promise.then(f);
            },
            filter: function (f) {
                var ret = new promhx_Stream(null);
                this._update.push({ async: ret, linkf: function (x) {
                        if (f(x))
                            ret.handleResolve(x);
                    } });
                promhx_base_AsyncBase.immediateLinkUpdate(this, ret, function (x1) {
                    return x1;
                });
                return ret;
            },
            concat: function (s) {
                var ret = new promhx_Stream(null);
                this._update.push({ async: ret, linkf: $bind(ret, ret.handleResolve) });
                promhx_base_AsyncBase.immediateLinkUpdate(this, ret, function (x) {
                    return x;
                });
                this._end_promise.then(function (_) {
                    s.pipe(function (x1) {
                        ret.handleResolve(x1);
                        return ret;
                    });
                    s._end_promise.then(function (_1) {
                        ret.end();
                    });
                });
                return ret;
            },
            merge: function (s) {
                var ret = new promhx_Stream(null);
                this._update.push({ async: ret, linkf: $bind(ret, ret.handleResolve) });
                s._update.push({ async: ret, linkf: $bind(ret, ret.handleResolve) });
                promhx_base_AsyncBase.immediateLinkUpdate(this, ret, function (x) {
                    return x;
                });
                promhx_base_AsyncBase.immediateLinkUpdate(s, ret, function (x1) {
                    return x1;
                });
                return ret;
            },
            __class__: promhx_Stream
        });
        var promhx_PublicStream = $hx_exports.promhx.PublicStream = function (def) {
            promhx_Stream.call(this, def);
        };
        $hxClasses["promhx.PublicStream"] = promhx_PublicStream;
        promhx_PublicStream.__name__ = ["promhx", "PublicStream"];
        promhx_PublicStream.publicstream = function (val) {
            var ps = new promhx_PublicStream(null);
            ps.handleResolve(val);
            return ps;
        };
        promhx_PublicStream.__super__ = promhx_Stream;
        promhx_PublicStream.prototype = $extend(promhx_Stream.prototype, {
            resolve: function (val) {
                this.handleResolve(val);
            },
            throwError: function (e) {
                this.handleError(e);
            },
            update: function (val) {
                this.handleResolve(val);
            },
            __class__: promhx_PublicStream
        });
        var promhx_base_EventLoop = function () { };
        $hxClasses["promhx.base.EventLoop"] = promhx_base_EventLoop;
        promhx_base_EventLoop.__name__ = ["promhx", "base", "EventLoop"];
        promhx_base_EventLoop.enqueue = function (eqf) {
            promhx_base_EventLoop.queue.add(eqf);
            promhx_base_EventLoop.continueOnNextLoop();
        };
        promhx_base_EventLoop.set_nextLoop = function (f) {
            if (promhx_base_EventLoop.nextLoop != null)
                throw new js__$Boot_HaxeError("nextLoop has already been set");
            else
                promhx_base_EventLoop.nextLoop = f;
            return promhx_base_EventLoop.nextLoop;
        };
        promhx_base_EventLoop.queueEmpty = function () {
            return promhx_base_EventLoop.queue.isEmpty();
        };
        promhx_base_EventLoop.finish = function (max_iterations) {
            if (max_iterations == null)
                max_iterations = 1000;
            var fn = null;
            while (max_iterations-- > 0 && (fn = promhx_base_EventLoop.queue.pop()) != null)
                fn();
            return promhx_base_EventLoop.queue.isEmpty();
        };
        promhx_base_EventLoop.clear = function () {
            promhx_base_EventLoop.queue = new List();
        };
        promhx_base_EventLoop.f = function () {
            var fn = promhx_base_EventLoop.queue.pop();
            if (fn != null)
                fn();
            if (!promhx_base_EventLoop.queue.isEmpty())
                promhx_base_EventLoop.continueOnNextLoop();
        };
        promhx_base_EventLoop.continueOnNextLoop = function () {
            if (promhx_base_EventLoop.nextLoop != null)
                promhx_base_EventLoop.nextLoop(promhx_base_EventLoop.f);
            else
                setImmediate(promhx_base_EventLoop.f);
        };
        var promhx_error_PromiseError = $hxClasses["promhx.error.PromiseError"] = { __ename__: ["promhx", "error", "PromiseError"], __constructs__: ["AlreadyResolved", "DownstreamNotFullfilled"] };
        promhx_error_PromiseError.AlreadyResolved = function (message) { var $x = ["AlreadyResolved", 0, message]; $x.__enum__ = promhx_error_PromiseError; $x.toString = $estr; return $x; };
        promhx_error_PromiseError.DownstreamNotFullfilled = function (message) { var $x = ["DownstreamNotFullfilled", 1, message]; $x.__enum__ = promhx_error_PromiseError; $x.toString = $estr; return $x; };
        var verb_Verb = function () { };
        $hxClasses["verb.Verb"] = verb_Verb;
        verb_Verb.__name__ = ["verb", "Verb"];
        verb_Verb.main = function () {
            // console.log("verb 2.1.0");
        };
        var verb_core_ArrayExtensions = function () { };
        $hxClasses["verb.core.ArrayExtensions"] = verb_core_ArrayExtensions;
        verb_core_ArrayExtensions.__name__ = ["verb", "core", "ArrayExtensions"];
        verb_core_ArrayExtensions.alloc = function (a, n) {
            if (n < 0)
                return;
            while (a.length < n)
                a.push(null);
        };
        verb_core_ArrayExtensions.reversed = function (a) {
            var ac = a.slice();
            ac.reverse();
            return ac;
        };
        verb_core_ArrayExtensions.last = function (a) {
            return a[a.length - 1];
        };
        verb_core_ArrayExtensions.first = function (a) {
            return a[0];
        };
        verb_core_ArrayExtensions.spliceAndInsert = function (a, start, end, ele) {
            a.splice(start, end);
            a.splice(start, 0, ele);
        };
        verb_core_ArrayExtensions.left = function (arr) {
            if (arr.length == 0)
                return [];
            var len = Math.ceil(arr.length / 2);
            return arr.slice(0, len);
        };
        verb_core_ArrayExtensions.right = function (arr) {
            if (arr.length == 0)
                return [];
            var len = Math.ceil(arr.length / 2);
            return arr.slice(len);
        };
        verb_core_ArrayExtensions.rightWithPivot = function (arr) {
            if (arr.length == 0)
                return [];
            var len = Math.ceil(arr.length / 2);
            return arr.slice(len - 1);
        };
        verb_core_ArrayExtensions.unique = function (arr, comp) {
            if (arr.length == 0)
                return [];
            var uniques = [arr.pop()];
            while (arr.length > 0) {
                var ele = arr.pop();
                var isUnique = true;
                var _g = 0;
                while (_g < uniques.length) {
                    var unique = uniques[_g];
                    ++_g;
                    if (comp(ele, unique)) {
                        isUnique = false;
                        break;
                    }
                }
                if (isUnique)
                    uniques.push(ele);
            }
            return uniques;
        };
        var verb_core_Binomial = function () { };
        $hxClasses["verb.core.Binomial"] = verb_core_Binomial;
        verb_core_Binomial.__name__ = ["verb", "core", "Binomial"];
        verb_core_Binomial.get = function (n, k) {
            if (k == 0.0)
                return 1.0;
            if (n == 0 || k > n)
                return 0.0;
            if (k > n - k)
                k = n - k;
            if (verb_core_Binomial.memo_exists(n, k))
                return verb_core_Binomial.get_memo(n, k);
            var r = 1;
            var n_o = n;
            var _g1 = 1;
            var _g = k + 1;
            while (_g1 < _g) {
                var d = _g1++;
                if (verb_core_Binomial.memo_exists(n_o, d)) {
                    n--;
                    r = verb_core_Binomial.get_memo(n_o, d);
                    continue;
                }
                r *= n--;
                r /= d;
                verb_core_Binomial.memoize(n_o, d, r);
            }
            return r;
        };
        verb_core_Binomial.get_no_memo = function (n, k) {
            if (k == 0)
                return 1;
            if (n == 0 || k > n)
                return 0;
            if (k > n - k)
                k = n - k;
            var r = 1;
            var n_o = n;
            var _g1 = 1;
            var _g = k + 1;
            while (_g1 < _g) {
                var d = _g1++;
                r *= n--;
                r /= d;
            }
            return r;
        };
        verb_core_Binomial.memo_exists = function (n, k) {
            return verb_core_Binomial.memo.h.hasOwnProperty(n) && verb_core_Binomial.memo.h[n].h.hasOwnProperty(k);
        };
        verb_core_Binomial.get_memo = function (n, k) {
            return verb_core_Binomial.memo.h[n].h[k];
        };
        verb_core_Binomial.memoize = function (n, k, val) {
            if (!verb_core_Binomial.memo.h.hasOwnProperty(n))
                verb_core_Binomial.memo.set(n, new haxe_ds_IntMap());
            verb_core_Binomial.memo.h[n].h[k] = val;
        };
        var verb_core_BoundingBox = $hx_exports.core.BoundingBox = function (pts) {
            this.max = null;
            this.min = null;
            this.dim = 3;
            this.initialized = false;
            if (pts != null)
                this.addRange(pts);
        };
        $hxClasses["verb.core.BoundingBox"] = verb_core_BoundingBox;
        verb_core_BoundingBox.__name__ = ["verb", "core", "BoundingBox"];
        verb_core_BoundingBox.intervalsOverlap = function (a1, a2, b1, b2, tol) {
            if (tol == null)
                tol = -1;
            var tol1;
            if (tol < -0.5)
                tol1 = verb_core_Constants.TOLERANCE;
            else
                tol1 = tol;
            var x1 = Math.min(a1, a2) - tol1;
            var x2 = Math.max(a1, a2) + tol1;
            var y1 = Math.min(b1, b2) - tol1;
            var y2 = Math.max(b1, b2) + tol1;
            return x1 >= y1 && x1 <= y2 || x2 >= y1 && x2 <= y2 || y1 >= x1 && y1 <= x2 || y2 >= x1 && y2 <= x2;
        };
        verb_core_BoundingBox.prototype = {
            fromPoint: function (pt) {
                return new verb_core_BoundingBox([pt]);
            },
            add: function (point) {
                if (!this.initialized) {
                    this.dim = point.length;
                    this.min = point.slice(0);
                    this.max = point.slice(0);
                    this.initialized = true;
                    return this;
                }
                var _g1 = 0;
                var _g = this.dim;
                while (_g1 < _g) {
                    var i = _g1++;
                    if (point[i] > this.max[i])
                        this.max[i] = point[i];
                    if (point[i] < this.min[i])
                        this.min[i] = point[i];
                }
                return this;
            },
            addRange: function (points) {
                var l = points.length;
                var _g = 0;
                while (_g < l) {
                    var i = _g++;
                    this.add(points[i]);
                }
                return this;
            },
            contains: function (point, tol) {
                if (tol == null)
                    tol = -1;
                if (!this.initialized)
                    return false;
                return this.intersects(new verb_core_BoundingBox([point]), tol);
            },
            intersects: function (bb, tol) {
                if (tol == null)
                    tol = -1;
                if (!this.initialized || !bb.initialized)
                    return false;
                var a1 = this.min;
                var a2 = this.max;
                var b1 = bb.min;
                var b2 = bb.max;
                var _g1 = 0;
                var _g = this.dim;
                while (_g1 < _g) {
                    var i = _g1++;
                    if (!verb_core_BoundingBox.intervalsOverlap(a1[i], a2[i], b1[i], b2[i], tol))
                        return false;
                }
                return true;
            },
            clear: function () {
                this.initialized = false;
                return this;
            },
            getLongestAxis: function () {
                var max = 0.0;
                var id = 0;
                var _g1 = 0;
                var _g = this.dim;
                while (_g1 < _g) {
                    var i = _g1++;
                    var l = this.getAxisLength(i);
                    if (l > max) {
                        max = l;
                        id = i;
                    }
                }
                return id;
            },
            getAxisLength: function (i) {
                if (i < 0 || i > this.dim - 1)
                    return 0.0;
                return Math.abs(this.min[i] - this.max[i]);
            },
            intersect: function (bb, tol) {
                if (!this.initialized)
                    return null;
                var a1 = this.min;
                var a2 = this.max;
                var b1 = bb.min;
                var b2 = bb.max;
                if (!this.intersects(bb, tol))
                    return null;
                var maxbb = [];
                var minbb = [];
                var _g1 = 0;
                var _g = this.dim;
                while (_g1 < _g) {
                    var i = _g1++;
                    maxbb.push(Math.min(a2[i], b2[i]));
                    minbb.push(Math.max(a1[i], b1[i]));
                }
                return new verb_core_BoundingBox([minbb, maxbb]);
            },
            __class__: verb_core_BoundingBox
        };
        var verb_core_Constants = $hx_exports.core.Constants = function () { };
        $hxClasses["verb.core.Constants"] = verb_core_Constants;
        verb_core_Constants.__name__ = ["verb", "core", "Constants"];
        var verb_core_SerializableBase = $hx_exports.core.SerializableBase = function () { };
        $hxClasses["verb.core.SerializableBase"] = verb_core_SerializableBase;
        verb_core_SerializableBase.__name__ = ["verb", "core", "SerializableBase"];
        verb_core_SerializableBase.prototype = {
            serialize: function () {
                var serializer = new haxe_Serializer();
                serializer.serialize(this);
                return serializer.toString();
            },
            __class__: verb_core_SerializableBase
        };
        var verb_core_Plane = $hx_exports.core.Plane = function (origin, normal) {
            this.origin = origin;
            this.normal = normal;
        };
        $hxClasses["verb.core.Plane"] = verb_core_Plane;
        verb_core_Plane.__name__ = ["verb", "core", "Plane"];
        verb_core_Plane.__super__ = verb_core_SerializableBase;
        verb_core_Plane.prototype = $extend(verb_core_SerializableBase.prototype, {
            __class__: verb_core_Plane
        });
        var verb_core_Ray = $hx_exports.core.Ray = function (origin, dir) {
            this.origin = origin;
            this.dir = dir;
        };
        $hxClasses["verb.core.Ray"] = verb_core_Ray;
        verb_core_Ray.__name__ = ["verb", "core", "Ray"];
        verb_core_Ray.__super__ = verb_core_SerializableBase;
        verb_core_Ray.prototype = $extend(verb_core_SerializableBase.prototype, {
            __class__: verb_core_Ray
        });
        var verb_core_NurbsCurveData = $hx_exports.core.NurbsCurveData = function (degree, knots, controlPoints) {
            this.degree = degree;
            this.controlPoints = controlPoints;
            this.knots = knots;
        };
        $hxClasses["verb.core.NurbsCurveData"] = verb_core_NurbsCurveData;
        verb_core_NurbsCurveData.__name__ = ["verb", "core", "NurbsCurveData"];
        verb_core_NurbsCurveData.__super__ = verb_core_SerializableBase;
        verb_core_NurbsCurveData.prototype = $extend(verb_core_SerializableBase.prototype, {
            __class__: verb_core_NurbsCurveData
        });
        var verb_core_NurbsSurfaceData = $hx_exports.core.NurbsSurfaceData = function (degreeU, degreeV, knotsU, knotsV, controlPoints) {
            this.degreeU = degreeU;
            this.degreeV = degreeV;
            this.knotsU = knotsU;
            this.knotsV = knotsV;
            this.controlPoints = controlPoints;
        };
        $hxClasses["verb.core.NurbsSurfaceData"] = verb_core_NurbsSurfaceData;
        verb_core_NurbsSurfaceData.__name__ = ["verb", "core", "NurbsSurfaceData"];
        verb_core_NurbsSurfaceData.__super__ = verb_core_SerializableBase;
        verb_core_NurbsSurfaceData.prototype = $extend(verb_core_SerializableBase.prototype, {
            __class__: verb_core_NurbsSurfaceData
        });
        var verb_core_MeshData = $hx_exports.core.MeshData = function (faces, points, normals, uvs) {
            this.faces = faces;
            this.points = points;
            this.normals = normals;
            this.uvs = uvs;
        };
        $hxClasses["verb.core.MeshData"] = verb_core_MeshData;
        verb_core_MeshData.__name__ = ["verb", "core", "MeshData"];
        verb_core_MeshData.empty = function () {
            return new verb_core_MeshData([], [], [], []);
        };
        verb_core_MeshData.__super__ = verb_core_SerializableBase;
        verb_core_MeshData.prototype = $extend(verb_core_SerializableBase.prototype, {
            __class__: verb_core_MeshData
        });
        var verb_core_PolylineData = $hx_exports.core.PolylineData = function (points, params) {
            this.points = points;
            this.params = params;
        };
        $hxClasses["verb.core.PolylineData"] = verb_core_PolylineData;
        verb_core_PolylineData.__name__ = ["verb", "core", "PolylineData"];
        verb_core_PolylineData.__super__ = verb_core_SerializableBase;
        verb_core_PolylineData.prototype = $extend(verb_core_SerializableBase.prototype, {
            __class__: verb_core_PolylineData
        });
        var verb_core_VolumeData = $hx_exports.core.VolumeData = function (degreeU, degreeV, degreeW, knotsU, knotsV, knotsW, controlPoints) {
            this.degreeU = degreeU;
            this.degreeV = degreeV;
            this.degreeW = degreeW;
            this.knotsU = knotsU;
            this.knotsV = knotsV;
            this.knotsW = knotsW;
            this.controlPoints = controlPoints;
        };
        $hxClasses["verb.core.VolumeData"] = verb_core_VolumeData;
        verb_core_VolumeData.__name__ = ["verb", "core", "VolumeData"];
        verb_core_VolumeData.__super__ = verb_core_SerializableBase;
        verb_core_VolumeData.prototype = $extend(verb_core_SerializableBase.prototype, {
            __class__: verb_core_VolumeData
        });
        var verb_core_Pair = $hx_exports.core.Pair = function (item1, item2) {
            this.item0 = item1;
            this.item1 = item2;
        };
        $hxClasses["verb.core.Pair"] = verb_core_Pair;
        verb_core_Pair.__name__ = ["verb", "core", "Pair"];
        verb_core_Pair.prototype = {
            __class__: verb_core_Pair
        };
        var verb_core_Interval = $hx_exports.core.Interval = function (min, max) {
            this.min = min;
            this.max = max;
        };
        $hxClasses["verb.core.Interval"] = verb_core_Interval;
        verb_core_Interval.__name__ = ["verb", "core", "Interval"];
        verb_core_Interval.prototype = {
            __class__: verb_core_Interval
        };
        var verb_core_CurveCurveIntersection = $hx_exports.core.CurveCurveIntersection = function (point0, point1, u0, u1) {
            this.point0 = point0;
            this.point1 = point1;
            this.u0 = u0;
            this.u1 = u1;
        };
        $hxClasses["verb.core.CurveCurveIntersection"] = verb_core_CurveCurveIntersection;
        verb_core_CurveCurveIntersection.__name__ = ["verb", "core", "CurveCurveIntersection"];
        verb_core_CurveCurveIntersection.prototype = {
            __class__: verb_core_CurveCurveIntersection
        };
        var verb_core_CurveSurfaceIntersection = $hx_exports.core.CurveSurfaceIntersection = function (u, uv, curvePoint, surfacePoint) {
            this.u = u;
            this.uv = uv;
            this.curvePoint = curvePoint;
            this.surfacePoint = surfacePoint;
        };
        $hxClasses["verb.core.CurveSurfaceIntersection"] = verb_core_CurveSurfaceIntersection;
        verb_core_CurveSurfaceIntersection.__name__ = ["verb", "core", "CurveSurfaceIntersection"];
        verb_core_CurveSurfaceIntersection.prototype = {
            __class__: verb_core_CurveSurfaceIntersection
        };
        var verb_core_MeshIntersectionPoint = $hx_exports.core.MeshIntersectionPoint = function (uv0, uv1, point, faceIndex0, faceIndex1) {
            this.visited = false;
            this.adj = null;
            this.opp = null;
            this.uv0 = uv0;
            this.uv1 = uv1;
            this.point = point;
            this.faceIndex0;
            this.faceIndex1;
        };
        $hxClasses["verb.core.MeshIntersectionPoint"] = verb_core_MeshIntersectionPoint;
        verb_core_MeshIntersectionPoint.__name__ = ["verb", "core", "MeshIntersectionPoint"];
        verb_core_MeshIntersectionPoint.prototype = {
            __class__: verb_core_MeshIntersectionPoint
        };
        var verb_core_PolylineMeshIntersection = $hx_exports.core.PolylineMeshIntersection = function (point, u, uv, polylineIndex, faceIndex) {
            this.point = point;
            this.u = u;
            this.uv = uv;
            this.polylineIndex = polylineIndex;
            this.faceIndex = faceIndex;
        };
        $hxClasses["verb.core.PolylineMeshIntersection"] = verb_core_PolylineMeshIntersection;
        verb_core_PolylineMeshIntersection.__name__ = ["verb", "core", "PolylineMeshIntersection"];
        verb_core_PolylineMeshIntersection.prototype = {
            __class__: verb_core_PolylineMeshIntersection
        };
        var verb_core_SurfaceSurfaceIntersectionPoint = $hx_exports.core.SurfaceSurfaceIntersectionPoint = function (uv0, uv1, point, dist) {
            this.uv0 = uv0;
            this.uv1 = uv1;
            this.point = point;
            this.dist = dist;
        };
        $hxClasses["verb.core.SurfaceSurfaceIntersectionPoint"] = verb_core_SurfaceSurfaceIntersectionPoint;
        verb_core_SurfaceSurfaceIntersectionPoint.__name__ = ["verb", "core", "SurfaceSurfaceIntersectionPoint"];
        verb_core_SurfaceSurfaceIntersectionPoint.prototype = {
            __class__: verb_core_SurfaceSurfaceIntersectionPoint
        };
        var verb_core_TriSegmentIntersection = $hx_exports.core.TriSegmentIntersection = function (point, s, t, r) {
            this.point = point;
            this.s = s;
            this.t = t;
            this.p = r;
        };
        $hxClasses["verb.core.TriSegmentIntersection"] = verb_core_TriSegmentIntersection;
        verb_core_TriSegmentIntersection.__name__ = ["verb", "core", "TriSegmentIntersection"];
        verb_core_TriSegmentIntersection.prototype = {
            __class__: verb_core_TriSegmentIntersection
        };
        var verb_core_CurveTriPoint = $hx_exports.core.CurveTriPoint = function (u, point, uv) {
            this.u = u;
            this.point = point;
            this.uv = uv;
        };
        $hxClasses["verb.core.CurveTriPoint"] = verb_core_CurveTriPoint;
        verb_core_CurveTriPoint.__name__ = ["verb", "core", "CurveTriPoint"];
        verb_core_CurveTriPoint.prototype = {
            __class__: verb_core_CurveTriPoint
        };
        var verb_core_SurfacePoint = function (point, normal, uv, id, degen) {
            if (degen == null)
                degen = false;
            if (id == null)
                id = -1;
            this.uv = uv;
            this.point = point;
            this.normal = normal;
            this.id = id;
            this.degen = degen;
        };
        $hxClasses["verb.core.SurfacePoint"] = verb_core_SurfacePoint;
        verb_core_SurfacePoint.__name__ = ["verb", "core", "SurfacePoint"];
        verb_core_SurfacePoint.fromUv = function (u, v) {
            return new verb_core_SurfacePoint(null, null, [u, v]);
        };
        verb_core_SurfacePoint.prototype = {
            __class__: verb_core_SurfacePoint
        };
        var verb_core_CurvePoint = $hx_exports.core.CurvePoint = function (u, pt) {
            this.u = u;
            this.pt = pt;
        };
        $hxClasses["verb.core.CurvePoint"] = verb_core_CurvePoint;
        verb_core_CurvePoint.__name__ = ["verb", "core", "CurvePoint"];
        verb_core_CurvePoint.prototype = {
            __class__: verb_core_CurvePoint
        };
        var verb_core_KdTree = $hx_exports.core.KdTree = function (points, distanceFunction) {
            this.dim = 3;
            this.points = points;
            this.distanceFunction = distanceFunction;
            this.dim = points[0].point.length;
            this.root = this.buildTree(points, 0, null);
        };
        $hxClasses["verb.core.KdTree"] = verb_core_KdTree;
        verb_core_KdTree.__name__ = ["verb", "core", "KdTree"];
        verb_core_KdTree.prototype = {
            buildTree: function (points, depth, parent) {
                var dim = depth % this.dim;
                var median;
                var node;
                if (points.length == 0)
                    return null;
                if (points.length == 1)
                    return new verb_core_KdNode(points[0], dim, parent);
                points.sort(function (a, b) {
                    var diff = a.point[dim] - b.point[dim];
                    if (diff == 0.0)
                        return 0;
                    else if (diff > 0)
                        return 1;
                    else
                        return -1;
                });
                median = Math.floor(points.length / 2);
                node = new verb_core_KdNode(points[median], dim, parent);
                node.left = this.buildTree(points.slice(0, median), depth + 1, node);
                node.right = this.buildTree(points.slice(median + 1), depth + 1, node);
                return node;
            },
            nearest: function (point, maxNodes, maxDistance) {
                var _g = this;
                var bestNodes = new verb_core_BinaryHeap(function (e) {
                    return -e.item1;
                });
                var nearestSearch;
                var nearestSearch1 = null;
                nearestSearch1 = function (node) {
                    var bestChild;
                    var dimension = node.dimension;
                    var ownDistance = _g.distanceFunction(point, node.kdPoint.point);
                    var linearPoint;
                    var _g1 = [];
                    var _g3 = 0;
                    var _g2 = _g.dim;
                    while (_g3 < _g2) {
                        var i1 = _g3++;
                        _g1.push(0.0);
                    }
                    linearPoint = _g1;
                    var linearDistance;
                    var otherChild;
                    var i;
                    var saveNode = function (node1, distance) {
                        bestNodes.push(new verb_core_Pair(node1, distance));
                        if (bestNodes.size() > maxNodes)
                            bestNodes.pop();
                    };
                    var _g31 = 0;
                    var _g21 = _g.dim;
                    while (_g31 < _g21) {
                        var i2 = _g31++;
                        if (i2 == node.dimension)
                            linearPoint[i2] = point[i2];
                        else
                            linearPoint[i2] = node.kdPoint.point[i2];
                    }
                    linearDistance = _g.distanceFunction(linearPoint, node.kdPoint.point);
                    if (node.right == null && node.left == null) {
                        if (bestNodes.size() < maxNodes || ownDistance < bestNodes.peek().item1)
                            saveNode(node, ownDistance);
                        return;
                    }
                    if (node.right == null)
                        bestChild = node.left;
                    else if (node.left == null)
                        bestChild = node.right;
                    else if (point[dimension] < node.kdPoint.point[dimension])
                        bestChild = node.left;
                    else
                        bestChild = node.right;
                    nearestSearch1(bestChild);
                    if (bestNodes.size() < maxNodes || ownDistance < bestNodes.peek().item1)
                        saveNode(node, ownDistance);
                    if (bestNodes.size() < maxNodes || Math.abs(linearDistance) < bestNodes.peek().item1) {
                        if (bestChild == node.left)
                            otherChild = node.right;
                        else
                            otherChild = node.left;
                        if (otherChild != null)
                            nearestSearch1(otherChild);
                    }
                };
                nearestSearch = nearestSearch1;
                var _g4 = 0;
                while (_g4 < maxNodes) {
                    var i3 = _g4++;
                    bestNodes.push(new verb_core_Pair(null, maxDistance));
                }
                nearestSearch(this.root);
                var result = [];
                var _g5 = 0;
                while (_g5 < maxNodes) {
                    var i4 = _g5++;
                    if (bestNodes.content[i4].item0 != null)
                        result.push(new verb_core_Pair(bestNodes.content[i4].item0.kdPoint, bestNodes.content[i4].item1));
                }
                return result;
            },
            __class__: verb_core_KdTree
        };
        var verb_core_BinaryHeap = function (scoreFunction) {
            this.content = [];
            this.scoreFunction = scoreFunction;
        };
        $hxClasses["verb.core.BinaryHeap"] = verb_core_BinaryHeap;
        verb_core_BinaryHeap.__name__ = ["verb", "core", "BinaryHeap"];
        verb_core_BinaryHeap.prototype = {
            push: function (element) {
                this.content.push(element);
                this.bubbleUp(this.content.length - 1);
            },
            pop: function () {
                var result = this.content[0];
                var end = this.content.pop();
                if (this.content.length > 0) {
                    this.content[0] = end;
                    this.sinkDown(0);
                }
                return result;
            },
            peek: function () {
                return this.content[0];
            },
            remove: function (node) {
                var len = this.content.length;
                var _g = 0;
                while (_g < len) {
                    var i = _g++;
                    if (this.content[i] == node) {
                        var end = this.content.pop();
                        if (i != len - 1) {
                            this.content[i] = end;
                            if (this.scoreFunction(end) < this.scoreFunction(node))
                                this.bubbleUp(i);
                            else
                                this.sinkDown(i);
                        }
                        return;
                    }
                }
                throw new js__$Boot_HaxeError("Node not found.");
            },
            size: function () {
                return this.content.length;
            },
            bubbleUp: function (n) {
                var element = this.content[n];
                while (n > 0) {
                    var parentN = Math.floor((n + 1.0) / 2) - 1;
                    var parent = this.content[parentN];
                    if (this.scoreFunction(element) < this.scoreFunction(parent)) {
                        this.content[parentN] = element;
                        this.content[n] = parent;
                        n = parentN;
                    }
                    else
                        break;
                }
            },
            sinkDown: function (n) {
                var length = this.content.length;
                var element = this.content[n];
                var elemScore = this.scoreFunction(element);
                while (true) {
                    var child2N = (n + 1) * 2;
                    var child1N = child2N - 1;
                    var swap = -1;
                    var child1Score = 0.0;
                    if (child1N < length) {
                        var child1 = this.content[child1N];
                        child1Score = this.scoreFunction(child1);
                        if (child1Score < elemScore)
                            swap = child1N;
                    }
                    if (child2N < length) {
                        var child2 = this.content[child2N];
                        var child2Score = this.scoreFunction(child2);
                        if (child2Score < (swap == -1 ? elemScore : child1Score))
                            swap = child2N;
                    }
                    if (swap != -1) {
                        this.content[n] = this.content[swap];
                        this.content[swap] = element;
                        n = swap;
                    }
                    else
                        break;
                }
            },
            __class__: verb_core_BinaryHeap
        };
        var verb_core_KdPoint = $hx_exports.core.KdPoint = function (point, obj) {
            this.point = point;
            this.obj = obj;
        };
        $hxClasses["verb.core.KdPoint"] = verb_core_KdPoint;
        verb_core_KdPoint.__name__ = ["verb", "core", "KdPoint"];
        verb_core_KdPoint.prototype = {
            __class__: verb_core_KdPoint
        };
        var verb_core_KdNode = $hx_exports.core.KdNode = function (kdPoint, dimension, parent) {
            this.kdPoint = kdPoint;
            this.left = null;
            this.right = null;
            this.parent = parent;
            this.dimension = dimension;
        };
        $hxClasses["verb.core.KdNode"] = verb_core_KdNode;
        verb_core_KdNode.__name__ = ["verb", "core", "KdNode"];
        verb_core_KdNode.prototype = {
            __class__: verb_core_KdNode
        };
        var verb_eval_IBoundingBoxTree = function () { };
        $hxClasses["verb.eval.IBoundingBoxTree"] = verb_eval_IBoundingBoxTree;
        verb_eval_IBoundingBoxTree.__name__ = ["verb", "eval", "IBoundingBoxTree"];
        verb_eval_IBoundingBoxTree.prototype = {
            __class__: verb_eval_IBoundingBoxTree
        };
        var verb_core_LazyCurveBoundingBoxTree = function (curve, knotTol) {
            this._boundingBox = null;
            this._curve = curve;
            if (knotTol == null)
                knotTol = verb_core_Vec.domain(this._curve.knots) / 64;
            this._knotTol = knotTol;
        };
        $hxClasses["verb.core.LazyCurveBoundingBoxTree"] = verb_core_LazyCurveBoundingBoxTree;
        verb_core_LazyCurveBoundingBoxTree.__name__ = ["verb", "core", "LazyCurveBoundingBoxTree"];
        verb_core_LazyCurveBoundingBoxTree.__interfaces__ = [verb_eval_IBoundingBoxTree];
        verb_core_LazyCurveBoundingBoxTree.prototype = {
            split: function () {
                var min = verb_core_ArrayExtensions.first(this._curve.knots);
                var max = verb_core_ArrayExtensions.last(this._curve.knots);
                var dom = max - min;
                var crvs = verb_eval_Divide.curveSplit(this._curve, (max + min) / 2.0 + dom * 0.1 * Math.random());
                return new verb_core_Pair(new verb_core_LazyCurveBoundingBoxTree(crvs[0], this._knotTol), new verb_core_LazyCurveBoundingBoxTree(crvs[1], this._knotTol));
            },
            boundingBox: function () {
                if (this._boundingBox == null)
                    this._boundingBox = new verb_core_BoundingBox(verb_eval_Eval.dehomogenize1d(this._curve.controlPoints));
                return this._boundingBox;
            },
            'yield': function () {
                return this._curve;
            },
            indivisible: function (tolerance) {
                return verb_core_Vec.domain(this._curve.knots) < this._knotTol;
            },
            empty: function () {
                return false;
            },
            __class__: verb_core_LazyCurveBoundingBoxTree
        };
        var verb_core_LazyMeshBoundingBoxTree = function (mesh, faceIndices) {
            this._boundingBox = null;
            this._mesh = mesh;
            if (faceIndices == null) {
                var _g = [];
                var _g2 = 0;
                var _g1 = mesh.faces.length;
                while (_g2 < _g1) {
                    var i = _g2++;
                    _g.push(i);
                }
                faceIndices = _g;
            }
            this._faceIndices = faceIndices;
        };
        $hxClasses["verb.core.LazyMeshBoundingBoxTree"] = verb_core_LazyMeshBoundingBoxTree;
        verb_core_LazyMeshBoundingBoxTree.__name__ = ["verb", "core", "LazyMeshBoundingBoxTree"];
        verb_core_LazyMeshBoundingBoxTree.__interfaces__ = [verb_eval_IBoundingBoxTree];
        verb_core_LazyMeshBoundingBoxTree.prototype = {
            split: function () {
                var $as = verb_core_Mesh.sortTrianglesOnLongestAxis(this.boundingBox(), this._mesh, this._faceIndices);
                var l = verb_core_ArrayExtensions.left($as);
                var r = verb_core_ArrayExtensions.right($as);
                return new verb_core_Pair(new verb_core_LazyMeshBoundingBoxTree(this._mesh, l), new verb_core_LazyMeshBoundingBoxTree(this._mesh, r));
            },
            boundingBox: function () {
                if (this._boundingBox == null)
                    this._boundingBox = verb_core_Mesh.makeMeshAabb(this._mesh, this._faceIndices);
                return this._boundingBox;
            },
            'yield': function () {
                return this._faceIndices[0];
            },
            indivisible: function (tolerance) {
                return this._faceIndices.length == 1;
            },
            empty: function () {
                return this._faceIndices.length == 0;
            },
            __class__: verb_core_LazyMeshBoundingBoxTree
        };
        var verb_core_LazyPolylineBoundingBoxTree = function (polyline, interval) {
            this._boundingBox = null;
            this._polyline = polyline;
            if (interval == null)
                interval = new verb_core_Interval(0, polyline.points.length != 0 ? polyline.points.length - 1 : 0);
            this._interval = interval;
        };
        $hxClasses["verb.core.LazyPolylineBoundingBoxTree"] = verb_core_LazyPolylineBoundingBoxTree;
        verb_core_LazyPolylineBoundingBoxTree.__name__ = ["verb", "core", "LazyPolylineBoundingBoxTree"];
        verb_core_LazyPolylineBoundingBoxTree.__interfaces__ = [verb_eval_IBoundingBoxTree];
        verb_core_LazyPolylineBoundingBoxTree.prototype = {
            split: function () {
                var min = this._interval.min;
                var max = this._interval.max;
                var pivot = min + Math.ceil((max - min) / 2);
                var l = new verb_core_Interval(min, pivot);
                var r = new verb_core_Interval(pivot, max);
                return new verb_core_Pair(new verb_core_LazyPolylineBoundingBoxTree(this._polyline, l), new verb_core_LazyPolylineBoundingBoxTree(this._polyline, r));
            },
            boundingBox: function () {
                if (this._boundingBox == null)
                    this._boundingBox = new verb_core_BoundingBox(this._polyline.points);
                return this._boundingBox;
            },
            'yield': function () {
                return this._interval.min;
            },
            indivisible: function (tolerance) {
                return this._interval.max - this._interval.min == 1;
            },
            empty: function () {
                return this._interval.max - this._interval.min == 0;
            },
            __class__: verb_core_LazyPolylineBoundingBoxTree
        };
        var verb_core_LazySurfaceBoundingBoxTree = function (surface, splitV, knotTolU, knotTolV) {
            if (splitV == null)
                splitV = false;
            this._boundingBox = null;
            this._surface = surface;
            this._splitV = splitV;
            if (knotTolU == null)
                knotTolU = verb_core_Vec.domain(surface.knotsU) / 16;
            if (knotTolV == null)
                knotTolV = verb_core_Vec.domain(surface.knotsV) / 16;
            this._knotTolU = knotTolU;
            this._knotTolV = knotTolV;
        };
        $hxClasses["verb.core.LazySurfaceBoundingBoxTree"] = verb_core_LazySurfaceBoundingBoxTree;
        verb_core_LazySurfaceBoundingBoxTree.__name__ = ["verb", "core", "LazySurfaceBoundingBoxTree"];
        verb_core_LazySurfaceBoundingBoxTree.__interfaces__ = [verb_eval_IBoundingBoxTree];
        verb_core_LazySurfaceBoundingBoxTree.prototype = {
            split: function () {
                var min;
                var max;
                if (this._splitV) {
                    min = verb_core_ArrayExtensions.first(this._surface.knotsV);
                    max = verb_core_ArrayExtensions.last(this._surface.knotsV);
                }
                else {
                    min = verb_core_ArrayExtensions.first(this._surface.knotsU);
                    max = verb_core_ArrayExtensions.last(this._surface.knotsU);
                }
                var dom = max - min;
                var pivot = (min + max) / 2.0;
                var srfs = verb_eval_Divide.surfaceSplit(this._surface, pivot, this._splitV);
                return new verb_core_Pair(new verb_core_LazySurfaceBoundingBoxTree(srfs[0], !this._splitV, this._knotTolU, this._knotTolV), new verb_core_LazySurfaceBoundingBoxTree(srfs[1], !this._splitV, this._knotTolU, this._knotTolV));
            },
            boundingBox: function () {
                if (this._boundingBox == null) {
                    this._boundingBox = new verb_core_BoundingBox();
                    var _g = 0;
                    var _g1 = this._surface.controlPoints;
                    while (_g < _g1.length) {
                        var row = _g1[_g];
                        ++_g;
                        this._boundingBox.addRange(verb_eval_Eval.dehomogenize1d(row));
                    }
                }
                return this._boundingBox;
            },
            'yield': function () {
                return this._surface;
            },
            indivisible: function (tolerance) {
                return verb_core_Vec.domain(this._surface.knotsV) < this._knotTolV && verb_core_Vec.domain(this._surface.knotsU) < this._knotTolU;
            },
            empty: function () {
                return false;
            },
            __class__: verb_core_LazySurfaceBoundingBoxTree
        };
        var verb_core_Mat = $hx_exports.core.Mat = function () { };
        $hxClasses["verb.core.Mat"] = verb_core_Mat;
        verb_core_Mat.__name__ = ["verb", "core", "Mat"];
        verb_core_Mat.mul = function (a, b) {
            var _g = [];
            var _g2 = 0;
            var _g1 = b.length;
            while (_g2 < _g1) {
                var i = _g2++;
                _g.push(verb_core_Vec.mul(a, b[i]));
            }
            return _g;
        };
        verb_core_Mat.mult = function (x, y) {
            var p;
            var q;
            var r;
            var ret;
            var foo;
            var bar;
            var woo;
            var i0;
            var k0;
            var p0;
            var r0;
            p = x.length;
            q = y.length;
            r = y[0].length;
            ret = [];
            var i = p - 1;
            var j = 0;
            var k = 0;
            while (i >= 0) {
                foo = [];
                bar = x[i];
                k = r - 1;
                while (k >= 0) {
                    woo = bar[q - 1] * y[q - 1][k];
                    j = q - 2;
                    while (j >= 1) {
                        i0 = j - 1;
                        woo += bar[j] * y[j][k] + bar[i0] * y[i0][k];
                        j -= 2;
                    }
                    if (j == 0)
                        woo += bar[0] * y[0][k];
                    foo[k] = woo;
                    k--;
                }
                ret[i] = foo;
                i--;
            }
            return ret;
        };
        verb_core_Mat.add = function (a, b) {
            var _g = [];
            var _g2 = 0;
            var _g1 = a.length;
            while (_g2 < _g1) {
                var i = _g2++;
                _g.push(verb_core_Vec.add(a[i], b[i]));
            }
            return _g;
        };
        verb_core_Mat.div = function (a, b) {
            var _g = [];
            var _g2 = 0;
            var _g1 = a.length;
            while (_g2 < _g1) {
                var i = _g2++;
                _g.push(verb_core_Vec.div(a[i], b));
            }
            return _g;
        };
        verb_core_Mat.sub = function (a, b) {
            var _g = [];
            var _g2 = 0;
            var _g1 = a.length;
            while (_g2 < _g1) {
                var i = _g2++;
                _g.push(verb_core_Vec.sub(a[i], b[i]));
            }
            return _g;
        };
        verb_core_Mat.dot = function (a, b) {
            var _g = [];
            var _g2 = 0;
            var _g1 = a.length;
            while (_g2 < _g1) {
                var i = _g2++;
                _g.push(verb_core_Vec.dot(a[i], b));
            }
            return _g;
        };
        verb_core_Mat.identity = function (n) {
            var zeros = verb_core_Vec.zeros2d(n, n);
            var _g = 0;
            while (_g < n) {
                var i = _g++;
                zeros[i][i] = 1.0;
            }
            return zeros;
        };
        verb_core_Mat.transpose = function (a) {
            if (a.length == 0)
                return [];
            var _g = [];
            var _g2 = 0;
            var _g1 = a[0].length;
            while (_g2 < _g1) {
                var i = _g2++;
                _g.push((function ($this) {
                    var $r;
                    var _g3 = [];
                    {
                        var _g5 = 0;
                        var _g4 = a.length;
                        while (_g5 < _g4) {
                            var j = _g5++;
                            _g3.push(a[j][i]);
                        }
                    }
                    $r = _g3;
                    return $r;
                }(this)));
            }
            return _g;
        };
        verb_core_Mat.solve = function (A, b) {
            return verb_core_Mat.LUsolve(verb_core_Mat.LU(A), b);
        };
        verb_core_Mat.LUsolve = function (LUP, b) {
            var i;
            var j;
            var LU = LUP.LU;
            var n = LU.length;
            var x = b.slice();
            var P = LUP.P;
            var Pi;
            var LUi;
            var LUii;
            var tmp;
            i = n - 1;
            while (i != -1) {
                x[i] = b[i];
                --i;
            }
            i = 0;
            while (i < n) {
                Pi = P[i];
                if (P[i] != i) {
                    tmp = x[i];
                    x[i] = x[Pi];
                    x[Pi] = tmp;
                }
                LUi = LU[i];
                j = 0;
                while (j < i) {
                    x[i] -= x[j] * LUi[j];
                    ++j;
                }
                ++i;
            }
            i = n - 1;
            while (i >= 0) {
                LUi = LU[i];
                j = i + 1;
                while (j < n) {
                    x[i] -= x[j] * LUi[j];
                    ++j;
                }
                x[i] /= LUi[i];
                --i;
            }
            return x;
        };
        verb_core_Mat.LU = function (A) {
            var abs = Math.abs;
            var i;
            var j;
            var k;
            var absAjk;
            var Akk;
            var Ak;
            var Pk;
            var Ai;
            var max;
            var _g = [];
            var _g2 = 0;
            var _g1 = A.length;
            while (_g2 < _g1) {
                var i1 = _g2++;
                _g.push(A[i1].slice());
            }
            A = _g;
            var n = A.length;
            var n1 = n - 1;
            var P = [];
            k = 0;
            while (k < n) {
                Pk = k;
                Ak = A[k];
                max = Math.abs(Ak[k]);
                j = k + 1;
                while (j < n) {
                    absAjk = Math.abs(A[j][k]);
                    if (max < absAjk) {
                        max = absAjk;
                        Pk = j;
                    }
                    ++j;
                }
                P[k] = Pk;
                if (Pk != k) {
                    A[k] = A[Pk];
                    A[Pk] = Ak;
                    Ak = A[k];
                }
                Akk = Ak[k];
                i = k + 1;
                while (i < n) {
                    A[i][k] /= Akk;
                    ++i;
                }
                i = k + 1;
                while (i < n) {
                    Ai = A[i];
                    j = k + 1;
                    while (j < n1) {
                        Ai[j] -= Ai[k] * Ak[j];
                        ++j;
                        Ai[j] -= Ai[k] * Ak[j];
                        ++j;
                    }
                    if (j == n1)
                        Ai[j] -= Ai[k] * Ak[j];
                    ++i;
                }
                ++k;
            }
            return new verb_core__$Mat_LUDecomp(A, P);
        };
        var verb_core__$Mat_LUDecomp = function (lu, p) {
            this.LU = lu;
            this.P = p;
        };
        $hxClasses["verb.core._Mat.LUDecomp"] = verb_core__$Mat_LUDecomp;
        verb_core__$Mat_LUDecomp.__name__ = ["verb", "core", "_Mat", "LUDecomp"];
        verb_core__$Mat_LUDecomp.prototype = {
            __class__: verb_core__$Mat_LUDecomp
        };
        var verb_core_Mesh = $hx_exports.core.Mesh = function () { };
        $hxClasses["verb.core.Mesh"] = verb_core_Mesh;
        verb_core_Mesh.__name__ = ["verb", "core", "Mesh"];
        verb_core_Mesh.getTriangleNorm = function (points, tri) {
            var v0 = points[tri[0]];
            var v1 = points[tri[1]];
            var v2 = points[tri[2]];
            var u = verb_core_Vec.sub(v1, v0);
            var v = verb_core_Vec.sub(v2, v0);
            var n = verb_core_Vec.cross(u, v);
            return verb_core_Vec.mul(1 / verb_core_Vec.norm(n), n);
        };
        verb_core_Mesh.makeMeshAabb = function (mesh, faceIndices) {
            var bb = new verb_core_BoundingBox();
            var _g = 0;
            while (_g < faceIndices.length) {
                var x = faceIndices[_g];
                ++_g;
                bb.add(mesh.points[mesh.faces[x][0]]);
                bb.add(mesh.points[mesh.faces[x][1]]);
                bb.add(mesh.points[mesh.faces[x][2]]);
            }
            return bb;
        };
        verb_core_Mesh.sortTrianglesOnLongestAxis = function (bb, mesh, faceIndices) {
            var longAxis = bb.getLongestAxis();
            var minCoordFaceMap = [];
            var _g = 0;
            while (_g < faceIndices.length) {
                var faceIndex = faceIndices[_g];
                ++_g;
                var tri_min = verb_core_Mesh.getMinCoordOnAxis(mesh.points, mesh.faces[faceIndex], longAxis);
                minCoordFaceMap.push(new verb_core_Pair(tri_min, faceIndex));
            }
            minCoordFaceMap.sort(function (a, b) {
                var a0 = a.item0;
                var b0 = b.item0;
                if (a0 == b0)
                    return 0;
                else if (a0 > b0)
                    return 1;
                else
                    return -1;
            });
            var sortedFaceIndices = [];
            var _g1 = 0;
            var _g2 = minCoordFaceMap.length;
            while (_g1 < _g2) {
                var i = _g1++;
                sortedFaceIndices.push(minCoordFaceMap[i].item1);
            }
            return sortedFaceIndices;
        };
        verb_core_Mesh.getMinCoordOnAxis = function (points, tri, axis) {
            var min = Infinity;
            var _g = 0;
            while (_g < 3) {
                var i = _g++;
                var coord = points[tri[i]][axis];
                if (coord < min)
                    min = coord;
            }
            return min;
        };
        verb_core_Mesh.getTriangleCentroid = function (points, tri) {
            var centroid = [0.0, 0.0, 0.0];
            var _g = 0;
            while (_g < 3) {
                var i = _g++;
                var _g1 = 0;
                while (_g1 < 3) {
                    var j = _g1++;
                    centroid[j] += points[tri[i]][j];
                }
            }
            var _g2 = 0;
            while (_g2 < 3) {
                var i1 = _g2++;
                centroid[i1] /= 3;
            }
            return centroid;
        };
        verb_core_Mesh.triangleUVFromPoint = function (mesh, faceIndex, f) {
            var tri = mesh.faces[faceIndex];
            var p1 = mesh.points[tri[0]];
            var p2 = mesh.points[tri[1]];
            var p3 = mesh.points[tri[2]];
            var uv1 = mesh.uvs[tri[0]];
            var uv2 = mesh.uvs[tri[1]];
            var uv3 = mesh.uvs[tri[2]];
            var f1 = verb_core_Vec.sub(p1, f);
            var f2 = verb_core_Vec.sub(p2, f);
            var f3 = verb_core_Vec.sub(p3, f);
            var a = verb_core_Vec.norm(verb_core_Vec.cross(verb_core_Vec.sub(p1, p2), verb_core_Vec.sub(p1, p3)));
            var a1 = verb_core_Vec.norm(verb_core_Vec.cross(f2, f3)) / a;
            var a2 = verb_core_Vec.norm(verb_core_Vec.cross(f3, f1)) / a;
            var a3 = verb_core_Vec.norm(verb_core_Vec.cross(f1, f2)) / a;
            return verb_core_Vec.add(verb_core_Vec.mul(a1, uv1), verb_core_Vec.add(verb_core_Vec.mul(a2, uv2), verb_core_Vec.mul(a3, uv3)));
        };
        var verb_core_MeshBoundingBoxTree = function (mesh, faceIndices) {
            this._empty = false;
            this._face = -1;
            if (faceIndices == null) {
                var _g = [];
                var _g2 = 0;
                var _g1 = mesh.faces.length;
                while (_g2 < _g1) {
                    var i = _g2++;
                    _g.push(i);
                }
                faceIndices = _g;
            }
            this._boundingBox = verb_core_Mesh.makeMeshAabb(mesh, faceIndices);
            if (faceIndices.length < 1) {
                this._empty = true;
                return;
            }
            else if (faceIndices.length < 2) {
                this._face = faceIndices[0];
                return;
            }
            var $as = verb_core_Mesh.sortTrianglesOnLongestAxis(this._boundingBox, mesh, faceIndices);
            var l = verb_core_ArrayExtensions.left($as);
            var r = verb_core_ArrayExtensions.right($as);
            this._children = new verb_core_Pair(new verb_core_MeshBoundingBoxTree(mesh, l), new verb_core_MeshBoundingBoxTree(mesh, r));
        };
        $hxClasses["verb.core.MeshBoundingBoxTree"] = verb_core_MeshBoundingBoxTree;
        verb_core_MeshBoundingBoxTree.__name__ = ["verb", "core", "MeshBoundingBoxTree"];
        verb_core_MeshBoundingBoxTree.__interfaces__ = [verb_eval_IBoundingBoxTree];
        verb_core_MeshBoundingBoxTree.prototype = {
            split: function () {
                return this._children;
            },
            boundingBox: function () {
                return this._boundingBox;
            },
            'yield': function () {
                return this._face;
            },
            indivisible: function (tolerance) {
                return this._children == null;
            },
            empty: function () {
                return this._empty;
            },
            __class__: verb_core_MeshBoundingBoxTree
        };
        var verb_core_Minimizer = $hx_exports.core.Minimizer = function () { };
        $hxClasses["verb.core.Minimizer"] = verb_core_Minimizer;
        verb_core_Minimizer.__name__ = ["verb", "core", "Minimizer"];
        verb_core_Minimizer.uncmin = function (f, x0, tol, gradient, maxit) {
            if (tol == null)
                tol = 1e-8;
            if (gradient == null)
                gradient = function (x) {
                    return verb_core_Minimizer.numericalGradient(f, x);
                };
            if (maxit == null)
                maxit = 1000;
            x0 = x0.slice(0);
            var n = x0.length;
            var f0 = f(x0);
            var f1 = f0;
            var df0;
            if (isNaN(f0))
                throw new js__$Boot_HaxeError("uncmin: f(x0) is a NaN!");
            tol = Math.max(tol, verb_core_Constants.EPSILON);
            var step;
            var g0;
            var g1;
            var H1 = verb_core_Mat.identity(n);
            var it = 0;
            var i;
            var s = [];
            var x1;
            var y;
            var Hy;
            var Hs;
            var ys;
            var i0;
            var t;
            var nstep;
            var t1;
            var t2;
            var msg = "";
            g0 = gradient(x0);
            while (it < maxit) {
                if (!verb_core_Vec.all(verb_core_Vec.finite(g0))) {
                    msg = "Gradient has Infinity or NaN";
                    break;
                }
                step = verb_core_Vec.neg(verb_core_Mat.dot(H1, g0));
                if (!verb_core_Vec.all(verb_core_Vec.finite(step))) {
                    msg = "Search direction has Infinity or NaN";
                    break;
                }
                nstep = verb_core_Vec.norm(step);
                if (nstep < tol) {
                    msg = "Newton step smaller than tol";
                    break;
                }
                t = 1.0;
                df0 = verb_core_Vec.dot(g0, step);
                x1 = x0;
                while (it < maxit) {
                    if (t * nstep < tol)
                        break;
                    s = verb_core_Vec.mul(t, step);
                    x1 = verb_core_Vec.add(x0, s);
                    f1 = f(x1);
                    if (f1 - f0 >= 0.1 * t * df0 || isNaN(f1)) {
                        t *= 0.5;
                        ++it;
                        continue;
                    }
                    break;
                }
                if (t * nstep < tol) {
                    msg = "Line search step size smaller than tol";
                    break;
                }
                if (it == maxit) {
                    msg = "maxit reached during line search";
                    break;
                }
                g1 = gradient(x1);
                y = verb_core_Vec.sub(g1, g0);
                ys = verb_core_Vec.dot(y, s);
                Hy = verb_core_Mat.dot(H1, y);
                H1 = verb_core_Mat.sub(verb_core_Mat.add(H1, verb_core_Mat.mul((ys + verb_core_Vec.dot(y, Hy)) / (ys * ys), verb_core_Minimizer.tensor(s, s))), verb_core_Mat.div(verb_core_Mat.add(verb_core_Minimizer.tensor(Hy, s), verb_core_Minimizer.tensor(s, Hy)), ys));
                x0 = x1;
                f0 = f1;
                g0 = g1;
                ++it;
            }
            return new verb_core_MinimizationResult(x0, f0, g0, H1, it, msg);
        };
        verb_core_Minimizer.numericalGradient = function (f, x) {
            var n = x.length;
            var f0 = f(x);
            if (f0 == NaN)
                throw new js__$Boot_HaxeError("gradient: f(x) is a NaN!");
            var i;
            var x0 = x.slice(0);
            var f1;
            var f2;
            var J = [];
            var errest;
            var roundoff;
            var eps = 1e-3;
            var t0;
            var t1;
            var t2;
            var it = 0;
            var d1;
            var d2;
            var N;
            var _g = 0;
            while (_g < n) {
                var i1 = _g++;
                var h = Math.max(1e-6 * f0, 1e-8);
                while (true) {
                    ++it;
                    if (it > 20)
                        throw new js__$Boot_HaxeError("Numerical gradient fails");
                    x0[i1] = x[i1] + h;
                    f1 = f(x0);
                    x0[i1] = x[i1] - h;
                    f2 = f(x0);
                    x0[i1] = x[i1];
                    if (isNaN(f1) || isNaN(f2)) {
                        h /= 16;
                        continue;
                    }
                    J[i1] = (f1 - f2) / (2 * h);
                    t0 = x[i1] - h;
                    t1 = x[i1];
                    t2 = x[i1] + h;
                    d1 = (f1 - f0) / h;
                    d2 = (f0 - f2) / h;
                    N = verb_core_Vec.max([Math.abs(J[i1]), Math.abs(f0), Math.abs(f1), Math.abs(f2), Math.abs(t0), Math.abs(t1), Math.abs(t2), 1e-8]);
                    errest = Math.min(verb_core_Vec.max([Math.abs(d1 - J[i1]), Math.abs(d2 - J[i1]), Math.abs(d1 - d2)]) / N, h / N);
                    if (errest > eps)
                        h /= 16;
                    else
                        break;
                }
            }
            return J;
        };
        verb_core_Minimizer.tensor = function (x, y) {
            var m = x.length;
            var n = y.length;
            var A = [];
            var Ai;
            var xi;
            var i = m - 1;
            while (i >= 0) {
                Ai = [];
                xi = x[i];
                var j = n - 1;
                while (j >= 3) {
                    Ai[j] = xi * y[j];
                    --j;
                    Ai[j] = xi * y[j];
                    --j;
                    Ai[j] = xi * y[j];
                    --j;
                    Ai[j] = xi * y[j];
                    --j;
                }
                while (j >= 0) {
                    Ai[j] = xi * y[j];
                    --j;
                }
                A[i] = Ai;
                i--;
            }
            return A;
        };
        var verb_core_MinimizationResult = function (solution, value, gradient, invHessian, iterations, message) {
            this.solution = solution;
            this.value = value;
            this.gradient = gradient;
            this.invHessian = invHessian;
            this.iterations = iterations;
            this.message = message;
        };
        $hxClasses["verb.core.MinimizationResult"] = verb_core_MinimizationResult;
        verb_core_MinimizationResult.__name__ = ["verb", "core", "MinimizationResult"];
        verb_core_MinimizationResult.prototype = {
            __class__: verb_core_MinimizationResult
        };
        var verb_core_ISerializable = function () { };
        $hxClasses["verb.core.ISerializable"] = verb_core_ISerializable;
        verb_core_ISerializable.__name__ = ["verb", "core", "ISerializable"];
        verb_core_ISerializable.prototype = {
            __class__: verb_core_ISerializable
        };
        var verb_core_Deserializer = $hx_exports.core.Deserializer = function () { };
        $hxClasses["verb.core.Deserializer"] = verb_core_Deserializer;
        verb_core_Deserializer.__name__ = ["verb", "core", "Deserializer"];
        verb_core_Deserializer.deserialize = function (s) {
            var unserializer = new haxe_Unserializer(s);
            var r = unserializer.unserialize();
            return r;
        };
        var verb_core_Trig = $hx_exports.core.Trig = function () { };
        $hxClasses["verb.core.Trig"] = verb_core_Trig;
        verb_core_Trig.__name__ = ["verb", "core", "Trig"];
        verb_core_Trig.isPointInPlane = function (pt, p, tol) {
            return Math.abs(verb_core_Vec.dot(verb_core_Vec.sub(pt, p.origin), p.normal)) < tol;
        };
        verb_core_Trig.distToSegment = function (a, b, c) {
            var res = verb_core_Trig.segmentClosestPoint(b, a, c, 0.0, 1.0);
            return verb_core_Vec.dist(b, res.pt);
        };
        verb_core_Trig.rayClosestPoint = function (pt, o, r) {
            var o2pt = verb_core_Vec.sub(pt, o);
            var do2ptr = verb_core_Vec.dot(o2pt, r);
            var proj = verb_core_Vec.add(o, verb_core_Vec.mul(do2ptr, r));
            return proj;
        };
        verb_core_Trig.distToRay = function (pt, o, r) {
            var d = verb_core_Trig.rayClosestPoint(pt, o, r);
            var dif = verb_core_Vec.sub(d, pt);
            return verb_core_Vec.norm(dif);
        };
        verb_core_Trig.threePointsAreFlat = function (p1, p2, p3, tol) {
            var p2mp1 = verb_core_Vec.sub(p2, p1);
            var p3mp1 = verb_core_Vec.sub(p3, p1);
            var norm = verb_core_Vec.cross(p2mp1, p3mp1);
            var area = verb_core_Vec.dot(norm, norm);
            return area < tol;
        };
        verb_core_Trig.segmentClosestPoint = function (pt, segpt0, segpt1, u0, u1) {
            var dif = verb_core_Vec.sub(segpt1, segpt0);
            var l = verb_core_Vec.norm(dif);
            if (l < verb_core_Constants.EPSILON)
                return { u: u0, pt: segpt0 };
            var o = segpt0;
            var r = verb_core_Vec.mul(1 / l, dif);
            var o2pt = verb_core_Vec.sub(pt, o);
            var do2ptr = verb_core_Vec.dot(o2pt, r);
            if (do2ptr < 0)
                return { u: u0, pt: segpt0 };
            else if (do2ptr > l)
                return { u: u1, pt: segpt1 };
            return { u: u0 + (u1 - u0) * do2ptr / l, pt: verb_core_Vec.add(o, verb_core_Vec.mul(do2ptr, r)) };
        };
        var verb_core_Vec = $hx_exports.core.Vec = function () { };
        $hxClasses["verb.core.Vec"] = verb_core_Vec;
        verb_core_Vec.__name__ = ["verb", "core", "Vec"];
        verb_core_Vec.angleBetween = function (a, b) {
            return Math.acos(verb_core_Vec.dot(a, b) / (verb_core_Vec.norm(a) * verb_core_Vec.norm(b)));
        };
        verb_core_Vec.positiveAngleBetween = function (a, b, n) {
            var nab = verb_core_Vec.cross(a, b);
            var al = verb_core_Vec.norm(a);
            var bl = verb_core_Vec.norm(b);
            var abl = al * bl;
            var adb = verb_core_Vec.dot(a, b);
            var sina = verb_core_Vec.norm(nab) / abl;
            var cosa = adb / abl;
            var w = Math.atan2(sina, cosa);
            var s = verb_core_Vec.dot(n, nab);
            if (Math.abs(s) < verb_core_Constants.EPSILON)
                return w;
            if (s > 0)
                return w;
            else
                return -w;
        };
        verb_core_Vec.signedAngleBetween = function (a, b, n) {
            var nab = verb_core_Vec.cross(a, b);
            var al = verb_core_Vec.norm(a);
            var bl = verb_core_Vec.norm(b);
            var abl = al * bl;
            var adb = verb_core_Vec.dot(a, b);
            var sina = verb_core_Vec.norm(nab) / abl;
            var cosa = adb / abl;
            var w = Math.atan2(sina, cosa);
            var s = verb_core_Vec.dot(n, nab);
            if (s > 0.0)
                return w;
            else
                return 2 * Math.PI - w;
        };
        verb_core_Vec.angleBetweenNormalized2d = function (a, b) {
            var perpDot = a[0] * b[1] - a[1] * b[0];
            return Math.atan2(perpDot, verb_core_Vec.dot(a, b));
        };
        verb_core_Vec.domain = function (a) {
            return verb_core_ArrayExtensions.last(a) - verb_core_ArrayExtensions.first(a);
        };
        verb_core_Vec.range = function (max) {
            var l = [];
            var f = 0.0;
            var _g = 0;
            while (_g < max) {
                var i = _g++;
                l.push(f);
                f += 1.0;
            }
            return l;
        };
        verb_core_Vec.span = function (min, max, step) {
            if (step == null)
                return [];
            if (step < verb_core_Constants.EPSILON)
                return [];
            if (min > max && step > 0.0)
                return [];
            if (max > min && step < 0.0)
                return [];
            var l = [];
            var cur = min;
            while (cur <= max) {
                l.push(cur);
                cur += step;
            }
            return l;
        };
        verb_core_Vec.neg = function (arr) {
            return arr.map(function (x) {
                return -x;
            });
        };
        verb_core_Vec.min = function (arr) {
            return Lambda.fold(arr, function (x, a) {
                return Math.min(x, a);
            }, Infinity);
        };
        verb_core_Vec.max = function (arr) {
            return Lambda.fold(arr, function (x, a) {
                return Math.max(x, a);
            }, -Infinity);
        };
        verb_core_Vec.all = function (arr) {
            return Lambda.fold(arr, function (x, a) {
                return a && x;
            }, true);
        };
        verb_core_Vec.finite = function (arr) {
            return arr.map(function (x) {
                return isFinite(x);
            });
        };
        verb_core_Vec.onRay = function (origin, dir, u) {
            return verb_core_Vec.add(origin, verb_core_Vec.mul(u, dir));
        };
        verb_core_Vec.lerp = function (i, u, v) {
            return verb_core_Vec.add(verb_core_Vec.mul(i, u), verb_core_Vec.mul(1.0 - i, v));
        };
        verb_core_Vec.normalized = function (arr) {
            return verb_core_Vec.div(arr, verb_core_Vec.norm(arr));
        };
        verb_core_Vec.cross = function (u, v) {
            return [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
        };
        verb_core_Vec.dist = function (a, b) {
            return verb_core_Vec.norm(verb_core_Vec.sub(a, b));
        };
        verb_core_Vec.distSquared = function (a, b) {
            return verb_core_Vec.normSquared(verb_core_Vec.sub(a, b));
        };
        verb_core_Vec.sum = function (a) {
            return Lambda.fold(a, function (x, a1) {
                return a1 + x;
            }, 0);
        };
        verb_core_Vec.addAll = function (a) {
            var i = $iterator(a)();
            if (!i.hasNext())
                return null;
            var f = i.next().length;
            return Lambda.fold(a, function (x, a1) {
                return verb_core_Vec.add(a1, x);
            }, verb_core_Vec.rep(f, 0.0));
        };
        verb_core_Vec.addAllMutate = function (a) {
            var f = a[0];
            var _g1 = 1;
            var _g = a.length;
            while (_g1 < _g) {
                var i = _g1++;
                verb_core_Vec.addMutate(f, a[i]);
            }
        };
        verb_core_Vec.addMulMutate = function (a, s, b) {
            var _g1 = 0;
            var _g = a.length;
            while (_g1 < _g) {
                var i = _g1++;
                a[i] = a[i] + s * b[i];
            }
        };
        verb_core_Vec.subMulMutate = function (a, s, b) {
            var _g1 = 0;
            var _g = a.length;
            while (_g1 < _g) {
                var i = _g1++;
                a[i] = a[i] - s * b[i];
            }
        };
        verb_core_Vec.addMutate = function (a, b) {
            var _g1 = 0;
            var _g = a.length;
            while (_g1 < _g) {
                var i = _g1++;
                a[i] = a[i] + b[i];
            }
        };
        verb_core_Vec.subMutate = function (a, b) {
            var _g1 = 0;
            var _g = a.length;
            while (_g1 < _g) {
                var i = _g1++;
                a[i] = a[i] - b[i];
            }
        };
        verb_core_Vec.mulMutate = function (a, b) {
            var _g1 = 0;
            var _g = b.length;
            while (_g1 < _g) {
                var i = _g1++;
                b[i] = b[i] * a;
            }
        };
        verb_core_Vec.norm = function (a) {
            var norm2 = verb_core_Vec.normSquared(a);
            if (norm2 != 0.0)
                return Math.sqrt(norm2);
            else
                return norm2;
        };
        verb_core_Vec.normSquared = function (a) {
            return Lambda.fold(a, function (x, a1) {
                return a1 + x * x;
            }, 0);
        };
        verb_core_Vec.rep = function (num, ele) {
            var _g = [];
            var _g1 = 0;
            while (_g1 < num) {
                var i = _g1++;
                _g.push(ele);
            }
            return _g;
        };
        verb_core_Vec.zeros1d = function (rows) {
            var _g = [];
            var _g1 = 0;
            while (_g1 < rows) {
                var i = _g1++;
                _g.push(0.0);
            }
            return _g;
        };
        verb_core_Vec.zeros2d = function (rows, cols) {
            var _g = [];
            var _g1 = 0;
            while (_g1 < rows) {
                var i = _g1++;
                _g.push(verb_core_Vec.zeros1d(cols));
            }
            return _g;
        };
        verb_core_Vec.zeros3d = function (rows, cols, depth) {
            var _g = [];
            var _g1 = 0;
            while (_g1 < rows) {
                var i = _g1++;
                _g.push(verb_core_Vec.zeros2d(cols, depth));
            }
            return _g;
        };
        verb_core_Vec.dot = function (a, b) {
            var sum = 0;
            var _g1 = 0;
            var _g = a.length;
            while (_g1 < _g) {
                var i = _g1++;
                sum += a[i] * b[i];
            }
            return sum;
        };
        verb_core_Vec.add = function (a, b) {
            var _g = [];
            var _g2 = 0;
            var _g1 = a.length;
            while (_g2 < _g1) {
                var i = _g2++;
                _g.push(a[i] + b[i]);
            }
            return _g;
        };
        verb_core_Vec.mul = function (a, b) {
            var _g = [];
            var _g2 = 0;
            var _g1 = b.length;
            while (_g2 < _g1) {
                var i = _g2++;
                _g.push(a * b[i]);
            }
            return _g;
        };
        verb_core_Vec.div = function (a, b) {
            var _g = [];
            var _g2 = 0;
            var _g1 = a.length;
            while (_g2 < _g1) {
                var i = _g2++;
                _g.push(a[i] / b);
            }
            return _g;
        };
        verb_core_Vec.sub = function (a, b) {
            var _g = [];
            var _g2 = 0;
            var _g1 = a.length;
            while (_g2 < _g1) {
                var i = _g2++;
                _g.push(a[i] - b[i]);
            }
            return _g;
        };
        verb_core_Vec.isZero = function (vec) {
            var _g1 = 0;
            var _g = vec.length;
            while (_g1 < _g) {
                var i = _g1++;
                if (Math.abs(vec[i]) > verb_core_Constants.TOLERANCE)
                    return false;
            }
            return true;
        };
        verb_core_Vec.sortedSetUnion = function (a, b) {
            var merged = [];
            var ai = 0;
            var bi = 0;
            while (ai < a.length || bi < b.length) {
                if (ai >= a.length) {
                    merged.push(b[bi]);
                    bi++;
                    continue;
                }
                else if (bi >= b.length) {
                    merged.push(a[ai]);
                    ai++;
                    continue;
                }
                var diff = a[ai] - b[bi];
                if (Math.abs(diff) < verb_core_Constants.EPSILON) {
                    merged.push(a[ai]);
                    ai++;
                    bi++;
                    continue;
                }
                if (diff > 0.0) {
                    merged.push(b[bi]);
                    bi++;
                    continue;
                }
                merged.push(a[ai]);
                ai++;
            }
            return merged;
        };
        verb_core_Vec.sortedSetSub = function (a, b) {
            var result = [];
            var ai = 0;
            var bi = 0;
            while (ai < a.length) {
                if (bi >= b.length) {
                    result.push(a[ai]);
                    ai++;
                    continue;
                }
                if (Math.abs(a[ai] - b[bi]) < verb_core_Constants.EPSILON) {
                    ai++;
                    bi++;
                    continue;
                }
                result.push(a[ai]);
                ai++;
            }
            return result;
        };
        var verb_eval_Analyze = $hx_exports.eval.Analyze = function () { };
        $hxClasses["verb.eval.Analyze"] = verb_eval_Analyze;
        verb_eval_Analyze.__name__ = ["verb", "eval", "Analyze"];
        verb_eval_Analyze.knotMultiplicities = function (knots) {
            var mults = [new verb_eval_KnotMultiplicity(knots[0], 0)];
            var curr = mults[0];
            var _g = 0;
            while (_g < knots.length) {
                var knot = knots[_g];
                ++_g;
                if (Math.abs(knot - curr.knot) > verb_core_Constants.EPSILON) {
                    curr = new verb_eval_KnotMultiplicity(knot, 0);
                    mults.push(curr);
                }
                curr.inc();
            }
            return mults;
        };
        verb_eval_Analyze.isRationalSurfaceClosed = function (surface, uDir) {
            if (uDir == null)
                uDir = true;
            var cpts;
            if (uDir)
                cpts = surface.controlPoints;
            else
                cpts = verb_core_Mat.transpose(surface.controlPoints);
            var _g1 = 0;
            var _g = cpts[0].length;
            while (_g1 < _g) {
                var i = _g1++;
                var test = verb_core_Vec.dist(verb_core_ArrayExtensions.first(cpts)[i], verb_core_ArrayExtensions.last(cpts)[i]) < verb_core_Constants.EPSILON;
                if (!test)
                    return false;
            }
            return true;
        };
        verb_eval_Analyze.rationalSurfaceClosestPoint = function (surface, p) {
            var uv = verb_eval_Analyze.rationalSurfaceClosestParam(surface, p);
            return verb_eval_Eval.rationalSurfacePoint(surface, uv[0], uv[1]);
        };
        verb_eval_Analyze.rationalSurfaceClosestParam = function (surface, p) {
            var maxits = 5;
            var i = 0;
            var e;
            var eps1 = 0.0001;
            var eps2 = 0.0005;
            var dif;
            var minu = surface.knotsU[0];
            var maxu = verb_core_ArrayExtensions.last(surface.knotsU);
            var minv = surface.knotsV[0];
            var maxv = verb_core_ArrayExtensions.last(surface.knotsV);
            var closedu = verb_eval_Analyze.isRationalSurfaceClosed(surface);
            var closedv = verb_eval_Analyze.isRationalSurfaceClosed(surface, false);
            var cuv;
            var tess = verb_eval_Tess.rationalSurfaceAdaptive(surface, new verb_eval_AdaptiveRefinementOptions());
            var dmin = Infinity;
            var _g1 = 0;
            var _g = tess.points.length;
            while (_g1 < _g) {
                var i1 = _g1++;
                var x = tess.points[i1];
                var d1 = verb_core_Vec.normSquared(verb_core_Vec.sub(p, x));
                if (d1 < dmin) {
                    dmin = d1;
                    cuv = tess.uvs[i1];
                }
            }
            var f = function (uv) {
                return verb_eval_Eval.rationalSurfaceDerivatives(surface, uv[0], uv[1], 2);
            };
            var n = function (uv1, e1, r) {
                var Su = e1[1][0];
                var Sv = e1[0][1];
                var Suu = e1[2][0];
                var Svv = e1[0][2];
                var Suv = e1[1][1];
                var Svu = e1[1][1];
                var f1 = verb_core_Vec.dot(Su, r);
                var g = verb_core_Vec.dot(Sv, r);
                var k = [-f1, -g];
                var J00 = verb_core_Vec.dot(Su, Su) + verb_core_Vec.dot(Suu, r);
                var J01 = verb_core_Vec.dot(Su, Sv) + verb_core_Vec.dot(Suv, r);
                var J10 = verb_core_Vec.dot(Su, Sv) + verb_core_Vec.dot(Svu, r);
                var J11 = verb_core_Vec.dot(Sv, Sv) + verb_core_Vec.dot(Svv, r);
                var J = [[J00, J01], [J10, J11]];
                var d = verb_core_Mat.solve(J, k);
                return verb_core_Vec.add(d, uv1);
            };
            while (i < maxits) {
                e = f(cuv);
                dif = verb_core_Vec.sub(e[0][0], p);
                var c1v = verb_core_Vec.norm(dif);
                var c2an = verb_core_Vec.dot(e[1][0], dif);
                var c2ad = verb_core_Vec.norm(e[1][0]) * c1v;
                var c2bn = verb_core_Vec.dot(e[0][1], dif);
                var c2bd = verb_core_Vec.norm(e[0][1]) * c1v;
                var c2av = c2an / c2ad;
                var c2bv = c2bn / c2bd;
                var c1 = c1v < eps1;
                var c2a = c2av < eps2;
                var c2b = c2bv < eps2;
                if (c1 && c2a && c2b)
                    return cuv;
                var ct = n(cuv, e, dif);
                if (ct[0] < minu)
                    if (closedu)
                        ct = [maxu - (ct[0] - minu), ct[1]];
                    else
                        ct = [minu + verb_core_Constants.EPSILON, ct[1]];
                else if (ct[0] > maxu)
                    if (closedu)
                        ct = [minu + (ct[0] - maxu), ct[1]];
                    else
                        ct = [maxu - verb_core_Constants.EPSILON, ct[1]];
                if (ct[1] < minv)
                    if (closedv)
                        ct = [ct[0], maxv - (ct[1] - minv)];
                    else
                        ct = [ct[0], minv + verb_core_Constants.EPSILON];
                else if (ct[1] > maxv)
                    if (closedv)
                        ct = [ct[0], minv + (ct[0] - maxv)];
                    else
                        ct = [ct[0], maxv - verb_core_Constants.EPSILON];
                var c3v0 = verb_core_Vec.norm(verb_core_Vec.mul(ct[0] - cuv[0], e[1][0]));
                var c3v1 = verb_core_Vec.norm(verb_core_Vec.mul(ct[1] - cuv[1], e[0][1]));
                if (c3v0 + c3v1 < eps1)
                    return cuv;
                cuv = ct;
                i++;
            }
            return cuv;
        };
        verb_eval_Analyze.rationalCurveClosestPoint = function (curve, p) {
            return verb_eval_Eval.rationalCurvePoint(curve, verb_eval_Analyze.rationalCurveClosestParam(curve, p));
        };
        verb_eval_Analyze.rationalCurveClosestParam = function (curve, p) {
            var min = Infinity;
            var u = 0.0;
            var pts = verb_eval_Tess.rationalCurveRegularSample(curve, curve.controlPoints.length * curve.degree, true);
            var _g1 = 0;
            var _g = pts.length - 1;
            while (_g1 < _g) {
                var i1 = _g1++;
                var u0 = pts[i1][0];
                var u11 = pts[i1 + 1][0];
                var p0 = pts[i1].slice(1);
                var p1 = pts[i1 + 1].slice(1);
                var proj = verb_core_Trig.segmentClosestPoint(p, p0, p1, u0, u11);
                var d1 = verb_core_Vec.norm(verb_core_Vec.sub(p, proj.pt));
                if (d1 < min) {
                    min = d1;
                    u = proj.u;
                }
            }
            var maxits = 5;
            var i = 0;
            var e;
            var eps1 = 0.0001;
            var eps2 = 0.0005;
            var dif;
            var minu = curve.knots[0];
            var maxu = verb_core_ArrayExtensions.last(curve.knots);
            var closed = verb_core_Vec.normSquared(verb_core_Vec.sub(curve.controlPoints[0], verb_core_ArrayExtensions.last(curve.controlPoints))) < verb_core_Constants.EPSILON;
            var cu = u;
            var f = function (u1) {
                return verb_eval_Eval.rationalCurveDerivatives(curve, u1, 2);
            };
            var n = function (u2, e1, d) {
                var f1 = verb_core_Vec.dot(e1[1], d);
                var s0 = verb_core_Vec.dot(e1[2], d);
                var s1 = verb_core_Vec.dot(e1[1], e1[1]);
                var df = s0 + s1;
                return u2 - f1 / df;
            };
            while (i < maxits) {
                e = f(cu);
                dif = verb_core_Vec.sub(e[0], p);
                var c1v = verb_core_Vec.norm(dif);
                var c2n = verb_core_Vec.dot(e[1], dif);
                var c2d = verb_core_Vec.norm(e[1]) * c1v;
                var c2v = c2n / c2d;
                var c1 = c1v < eps1;
                var c2 = Math.abs(c2v) < eps2;
                if (c1 && c2)
                    return cu;
                var ct = n(cu, e, dif);
                if (ct < minu)
                    if (closed)
                        ct = maxu - (ct - minu);
                    else
                        ct = minu;
                else if (ct > maxu)
                    if (closed)
                        ct = minu + (ct - maxu);
                    else
                        ct = maxu;
                var c3v = verb_core_Vec.norm(verb_core_Vec.mul(ct - cu, e[1]));
                if (c3v < eps1)
                    return cu;
                cu = ct;
                i++;
            }
            return cu;
        };
        verb_eval_Analyze.rationalCurveParamAtArcLength = function (curve, len, tol, beziers, bezierLengths) {
            if (tol == null)
                tol = 1e-3;
            if (len < verb_core_Constants.EPSILON)
                return curve.knots[0];
            var crvs;
            if (beziers != null)
                crvs = beziers;
            else
                crvs = verb_eval_Modify.decomposeCurveIntoBeziers(curve);
            var i = 0;
            var cc = crvs[i];
            var cl = -verb_core_Constants.EPSILON;
            var bezier_lengths;
            if (bezierLengths != null)
                bezier_lengths = bezierLengths;
            else
                bezier_lengths = [];
            while (cl < len && i < crvs.length) {
                if (i < bezier_lengths.length)
                    bezier_lengths[i] = bezier_lengths[i];
                else
                    bezier_lengths[i] = verb_eval_Analyze.rationalBezierCurveArcLength(curve);
                cl += bezier_lengths[i];
                if (len < cl + verb_core_Constants.EPSILON)
                    return verb_eval_Analyze.rationalBezierCurveParamAtArcLength(curve, len, tol, bezier_lengths[i]);
                i++;
            }
            return -1;
        };
        verb_eval_Analyze.rationalBezierCurveParamAtArcLength = function (curve, len, tol, totalLength) {
            if (len < 0)
                return curve.knots[0];
            var totalLen;
            if (totalLength != null)
                totalLen = totalLength;
            else
                totalLen = verb_eval_Analyze.rationalBezierCurveArcLength(curve);
            if (len > totalLen)
                return verb_core_ArrayExtensions.last(curve.knots);
            var start_p = curve.knots[0];
            var start_l = 0.0;
            var end_p = verb_core_ArrayExtensions.last(curve.knots);
            var end_l = totalLen;
            var mid_p = 0.0;
            var mid_l = 0.0;
            var tol1;
            if (tol != null)
                tol1 = tol;
            else
                tol1 = verb_core_Constants.TOLERANCE * 2;
            while (end_l - start_l > tol1) {
                mid_p = (start_p + end_p) / 2;
                mid_l = verb_eval_Analyze.rationalBezierCurveArcLength(curve, mid_p);
                if (mid_l > len) {
                    end_p = mid_p;
                    end_l = mid_l;
                }
                else {
                    start_p = mid_p;
                    start_l = mid_l;
                }
            }
            return (start_p + end_p) / 2;
        };
        verb_eval_Analyze.rationalCurveArcLength = function (curve, u, gaussDegIncrease) {
            if (gaussDegIncrease == null)
                gaussDegIncrease = 16;
            if (u == null)
                u = verb_core_ArrayExtensions.last(curve.knots);
            else
                u = u;
            var crvs = verb_eval_Modify.decomposeCurveIntoBeziers(curve);
            var i = 0;
            var cc = crvs[0];
            var sum = 0.0;
            while (i < crvs.length && cc.knots[0] + verb_core_Constants.EPSILON < u) {
                var param = Math.min(verb_core_ArrayExtensions.last(cc.knots), u);
                sum += verb_eval_Analyze.rationalBezierCurveArcLength(cc, param, gaussDegIncrease);
                cc = crvs[++i];
            }
            return sum;
        };
        verb_eval_Analyze.rationalBezierCurveArcLength = function (curve, u, gaussDegIncrease) {
            if (gaussDegIncrease == null)
                gaussDegIncrease = 16;
            var u1;
            if (u == null)
                u1 = verb_core_ArrayExtensions.last(curve.knots);
            else
                u1 = u;
            var z = (u1 - curve.knots[0]) / 2;
            var sum = 0.0;
            var gaussDeg = curve.degree + gaussDegIncrease;
            var cu;
            var tan;
            var _g = 0;
            while (_g < gaussDeg) {
                var i = _g++;
                cu = z * verb_eval_Analyze.Tvalues[gaussDeg][i] + z + curve.knots[0];
                tan = verb_eval_Eval.rationalCurveDerivatives(curve, cu, 1);
                sum += verb_eval_Analyze.Cvalues[gaussDeg][i] * verb_core_Vec.norm(tan[1]);
            }
            return z * sum;
        };
        var verb_eval_KnotMultiplicity = $hx_exports.eval.KnotMultiplicity = function (knot, mult) {
            this.knot = knot;
            this.mult = mult;
        };
        $hxClasses["verb.eval.KnotMultiplicity"] = verb_eval_KnotMultiplicity;
        verb_eval_KnotMultiplicity.__name__ = ["verb", "eval", "KnotMultiplicity"];
        verb_eval_KnotMultiplicity.prototype = {
            inc: function () {
                this.mult++;
            },
            __class__: verb_eval_KnotMultiplicity
        };
        var verb_eval_Check = $hx_exports.eval.Check = function () { };
        $hxClasses["verb.eval.Check"] = verb_eval_Check;
        verb_eval_Check.__name__ = ["verb", "eval", "Check"];
        verb_eval_Check.isValidKnotVector = function (vec, degree) {
            if (vec.length == 0)
                return false;
            if (vec.length < (degree + 1) * 2)
                return false;
            var rep = verb_core_ArrayExtensions.first(vec);
            var _g1 = 0;
            var _g = degree + 1;
            while (_g1 < _g) {
                var i = _g1++;
                if (Math.abs(vec[i] - rep) > verb_core_Constants.EPSILON)
                    return false;
            }
            rep = verb_core_ArrayExtensions.last(vec);
            var _g11 = vec.length - degree - 1;
            var _g2 = vec.length;
            while (_g11 < _g2) {
                var i1 = _g11++;
                if (Math.abs(vec[i1] - rep) > verb_core_Constants.EPSILON)
                    return false;
            }
            return verb_eval_Check.isNonDecreasing(vec);
        };
        verb_eval_Check.isNonDecreasing = function (vec) {
            var rep = verb_core_ArrayExtensions.first(vec);
            var _g1 = 0;
            var _g = vec.length;
            while (_g1 < _g) {
                var i = _g1++;
                if (vec[i] < rep - verb_core_Constants.EPSILON)
                    return false;
                rep = vec[i];
            }
            return true;
        };
        verb_eval_Check.isValidNurbsCurveData = function (data) {
            if (data.controlPoints == null)
                throw new js__$Boot_HaxeError("Control points array cannot be null!");
            if (data.degree == null)
                throw new js__$Boot_HaxeError("Degree cannot be null!");
            if (data.degree < 1)
                throw new js__$Boot_HaxeError("Degree must be greater than 1!");
            if (data.knots == null)
                throw new js__$Boot_HaxeError("Knots cannot be null!");
            if (data.knots.length != data.controlPoints.length + data.degree + 1)
                throw new js__$Boot_HaxeError("controlPoints.length + degree + 1 must equal knots.length!");
            if (!verb_eval_Check.isValidKnotVector(data.knots, data.degree))
                throw new js__$Boot_HaxeError("Invalid knot vector format!  Should begin with degree + 1 repeats and end with degree + 1 repeats!");
            return data;
        };
        verb_eval_Check.isValidNurbsSurfaceData = function (data) {
            if (data.controlPoints == null)
                throw new js__$Boot_HaxeError("Control points array cannot be null!");
            if (data.degreeU == null)
                throw new js__$Boot_HaxeError("DegreeU cannot be null!");
            if (data.degreeV == null)
                throw new js__$Boot_HaxeError("DegreeV cannot be null!");
            if (data.degreeU < 1)
                throw new js__$Boot_HaxeError("DegreeU must be greater than 1!");
            if (data.degreeV < 1)
                throw new js__$Boot_HaxeError("DegreeV must be greater than 1!");
            if (data.knotsU == null)
                throw new js__$Boot_HaxeError("KnotsU cannot be null!");
            if (data.knotsV == null)
                throw new js__$Boot_HaxeError("KnotsV cannot be null!");
            if (data.knotsU.length != data.controlPoints.length + data.degreeU + 1)
                throw new js__$Boot_HaxeError("controlPointsU.length + degreeU + 1 must equal knotsU.length!");
            if (data.knotsV.length != data.controlPoints[0].length + data.degreeV + 1)
                throw new js__$Boot_HaxeError("controlPointsV.length + degreeV + 1 must equal knotsV.length!");
            if (!verb_eval_Check.isValidKnotVector(data.knotsU, data.degreeU) || !verb_eval_Check.isValidKnotVector(data.knotsV, data.degreeV))
                throw new js__$Boot_HaxeError("Invalid knot vector format!  Should begin with degree + 1 repeats and end with degree + 1 repeats!");
            return data;
        };
        var verb_eval_Divide = $hx_exports.eval.Divide = function () { };
        $hxClasses["verb.eval.Divide"] = verb_eval_Divide;
        verb_eval_Divide.__name__ = ["verb", "eval", "Divide"];
        verb_eval_Divide.surfaceSplit = function (surface, u, useV) {
            if (useV == null)
                useV = false;
            var knots;
            var degree;
            var controlPoints;
            if (!useV) {
                controlPoints = verb_core_Mat.transpose(surface.controlPoints);
                knots = surface.knotsU;
                degree = surface.degreeU;
            }
            else {
                controlPoints = surface.controlPoints;
                knots = surface.knotsV;
                degree = surface.degreeV;
            }
            var knots_to_insert;
            var _g = [];
            var _g2 = 0;
            var _g1 = degree + 1;
            while (_g2 < _g1) {
                var i = _g2++;
                _g.push(u);
            }
            knots_to_insert = _g;
            var newpts0 = [];
            var newpts1 = [];
            var s = verb_eval_Eval.knotSpan(degree, u, knots);
            var res = null;
            var _g11 = 0;
            while (_g11 < controlPoints.length) {
                var cps = controlPoints[_g11];
                ++_g11;
                res = verb_eval_Modify.curveKnotRefine(new verb_core_NurbsCurveData(degree, knots, cps), knots_to_insert);
                newpts0.push(res.controlPoints.slice(0, s + 1));
                newpts1.push(res.controlPoints.slice(s + 1));
            }
            var knots0 = res.knots.slice(0, s + degree + 2);
            var knots1 = res.knots.slice(s + 1);
            if (!useV) {
                newpts0 = verb_core_Mat.transpose(newpts0);
                newpts1 = verb_core_Mat.transpose(newpts1);
                return [new verb_core_NurbsSurfaceData(degree, surface.degreeV, knots0, surface.knotsV.slice(), newpts0), new verb_core_NurbsSurfaceData(degree, surface.degreeV, knots1, surface.knotsV.slice(), newpts1)];
            }
            return [new verb_core_NurbsSurfaceData(surface.degreeU, degree, surface.knotsU.slice(), knots0, newpts0), new verb_core_NurbsSurfaceData(surface.degreeU, degree, surface.knotsU.slice(), knots1, newpts1)];
        };
        verb_eval_Divide.curveSplit = function (curve, u) {
            var degree = curve.degree;
            var controlPoints = curve.controlPoints;
            var knots = curve.knots;
            var knots_to_insert;
            var _g = [];
            var _g2 = 0;
            var _g1 = degree + 1;
            while (_g2 < _g1) {
                var i = _g2++;
                _g.push(u);
            }
            knots_to_insert = _g;
            var res = verb_eval_Modify.curveKnotRefine(curve, knots_to_insert);
            var s = verb_eval_Eval.knotSpan(degree, u, knots);
            var knots0 = res.knots.slice(0, s + degree + 2);
            var knots1 = res.knots.slice(s + 1);
            var cpts0 = res.controlPoints.slice(0, s + 1);
            var cpts1 = res.controlPoints.slice(s + 1);
            return [new verb_core_NurbsCurveData(degree, knots0, cpts0), new verb_core_NurbsCurveData(degree, knots1, cpts1)];
        };
        verb_eval_Divide.rationalCurveByEqualArcLength = function (curve, num) {
            var tlen = verb_eval_Analyze.rationalCurveArcLength(curve);
            var inc = tlen / num;
            return verb_eval_Divide.rationalCurveByArcLength(curve, inc);
        };
        verb_eval_Divide.rationalCurveByArcLength = function (curve, l) {
            var crvs = verb_eval_Modify.decomposeCurveIntoBeziers(curve);
            var crvlens = crvs.map(function (x) {
                return verb_eval_Analyze.rationalBezierCurveArcLength(x);
            });
            var totlen = verb_core_Vec.sum(crvlens);
            var pts = [new verb_eval_CurveLengthSample(curve.knots[0], 0.0)];
            if (l > totlen)
                return pts;
            var inc = l;
            var i = 0;
            var lc = inc;
            var runsum = 0.0;
            var runsum1 = 0.0;
            var u;
            while (i < crvs.length) {
                runsum += crvlens[i];
                while (lc < runsum + verb_core_Constants.EPSILON) {
                    u = verb_eval_Analyze.rationalBezierCurveParamAtArcLength(crvs[i], lc - runsum1, verb_core_Constants.TOLERANCE, crvlens[i]);
                    pts.push(new verb_eval_CurveLengthSample(u, lc));
                    lc += inc;
                }
                runsum1 += crvlens[i];
                i++;
            }
            return pts;
        };
        var verb_eval_CurveLengthSample = $hx_exports.eval.CurveLengthSample = function (u, len) {
            this.u = u;
            this.len = len;
        };
        $hxClasses["verb.eval.CurveLengthSample"] = verb_eval_CurveLengthSample;
        verb_eval_CurveLengthSample.__name__ = ["verb", "eval", "CurveLengthSample"];
        verb_eval_CurveLengthSample.prototype = {
            __class__: verb_eval_CurveLengthSample
        };
        var verb_eval_Eval = $hx_exports.eval.Eval = function () { };
        $hxClasses["verb.eval.Eval"] = verb_eval_Eval;
        verb_eval_Eval.__name__ = ["verb", "eval", "Eval"];
        verb_eval_Eval.rationalCurveTangent = function (curve, u) {
            var derivs = verb_eval_Eval.rationalCurveDerivatives(curve, u, 1);
            return derivs[1];
        };
        verb_eval_Eval.rationalSurfaceNormal = function (surface, u, v) {
            var derivs = verb_eval_Eval.rationalSurfaceDerivatives(surface, u, v, 1);
            return verb_core_Vec.cross(derivs[1][0], derivs[0][1]);
        };
        verb_eval_Eval.rationalSurfaceDerivatives = function (surface, u, v, numDerivs) {
            if (numDerivs == null)
                numDerivs = 1;
            var ders = verb_eval_Eval.surfaceDerivatives(surface, u, v, numDerivs);
            var Aders = verb_eval_Eval.rational2d(ders);
            var wders = verb_eval_Eval.weight2d(ders);
            var SKL = [];
            var dim = Aders[0][0].length;
            var _g1 = 0;
            var _g = numDerivs + 1;
            while (_g1 < _g) {
                var k = _g1++;
                SKL.push([]);
                var _g3 = 0;
                var _g2 = numDerivs - k + 1;
                while (_g3 < _g2) {
                    var l = _g3++;
                    var v1 = Aders[k][l];
                    var _g5 = 1;
                    var _g4 = l + 1;
                    while (_g5 < _g4) {
                        var j = _g5++;
                        verb_core_Vec.subMulMutate(v1, verb_core_Binomial.get(l, j) * wders[0][j], SKL[k][l - j]);
                    }
                    var _g51 = 1;
                    var _g41 = k + 1;
                    while (_g51 < _g41) {
                        var i = _g51++;
                        verb_core_Vec.subMulMutate(v1, verb_core_Binomial.get(k, i) * wders[i][0], SKL[k - i][l]);
                        var v2 = verb_core_Vec.zeros1d(dim);
                        var _g7 = 1;
                        var _g6 = l + 1;
                        while (_g7 < _g6) {
                            var j1 = _g7++;
                            verb_core_Vec.addMulMutate(v2, verb_core_Binomial.get(l, j1) * wders[i][j1], SKL[k - i][l - j1]);
                        }
                        verb_core_Vec.subMulMutate(v1, verb_core_Binomial.get(k, i), v2);
                    }
                    verb_core_Vec.mulMutate(1 / wders[0][0], v1);
                    SKL[k].push(v1);
                }
            }
            return SKL;
        };
        verb_eval_Eval.rationalSurfacePoint = function (surface, u, v) {
            return verb_eval_Eval.dehomogenize(verb_eval_Eval.surfacePoint(surface, u, v));
        };
        verb_eval_Eval.rationalCurveDerivatives = function (curve, u, numDerivs) {
            if (numDerivs == null)
                numDerivs = 1;
            var ders = verb_eval_Eval.curveDerivatives(curve, u, numDerivs);
            var Aders = verb_eval_Eval.rational1d(ders);
            var wders = verb_eval_Eval.weight1d(ders);
            var k = 0;
            var i = 0;
            var CK = [];
            var _g1 = 0;
            var _g = numDerivs + 1;
            while (_g1 < _g) {
                var k1 = _g1++;
                var v = Aders[k1];
                var _g3 = 1;
                var _g2 = k1 + 1;
                while (_g3 < _g2) {
                    var i1 = _g3++;
                    verb_core_Vec.subMulMutate(v, verb_core_Binomial.get(k1, i1) * wders[i1], CK[k1 - i1]);
                }
                verb_core_Vec.mulMutate(1 / wders[0], v);
                CK.push(v);
            }
            return CK;
        };
        verb_eval_Eval.rationalCurvePoint = function (curve, u) {
            return verb_eval_Eval.dehomogenize(verb_eval_Eval.curvePoint(curve, u));
        };
        verb_eval_Eval.surfaceDerivatives = function (surface, u, v, numDerivs) {
            var n = surface.knotsU.length - surface.degreeU - 2;
            var m = surface.knotsV.length - surface.degreeV - 2;
            return verb_eval_Eval.surfaceDerivativesGivenNM(n, m, surface, u, v, numDerivs);
        };
        verb_eval_Eval.surfaceDerivativesGivenNM = function (n, m, surface, u, v, numDerivs) {
            var degreeU = surface.degreeU;
            var degreeV = surface.degreeV;
            var controlPoints = surface.controlPoints;
            var knotsU = surface.knotsU;
            var knotsV = surface.knotsV;
            if (!verb_eval_Eval.areValidRelations(degreeU, controlPoints.length, knotsU.length) || !verb_eval_Eval.areValidRelations(degreeV, controlPoints[0].length, knotsV.length))
                throw new js__$Boot_HaxeError("Invalid relations between control points, knot vector, and n");
            var dim = controlPoints[0][0].length;
            var du;
            if (numDerivs < degreeU)
                du = numDerivs;
            else
                du = degreeU;
            var dv;
            if (numDerivs < degreeV)
                dv = numDerivs;
            else
                dv = degreeV;
            var SKL = verb_core_Vec.zeros3d(numDerivs + 1, numDerivs + 1, dim);
            var knotSpan_index_u = verb_eval_Eval.knotSpanGivenN(n, degreeU, u, knotsU);
            var knotSpan_index_v = verb_eval_Eval.knotSpanGivenN(m, degreeV, v, knotsV);
            var uders = verb_eval_Eval.derivativeBasisFunctionsGivenNI(knotSpan_index_u, u, degreeU, n, knotsU);
            var vders = verb_eval_Eval.derivativeBasisFunctionsGivenNI(knotSpan_index_v, v, degreeV, m, knotsV);
            var temp = verb_core_Vec.zeros2d(degreeV + 1, dim);
            var dd = 0;
            var _g1 = 0;
            var _g = du + 1;
            while (_g1 < _g) {
                var k = _g1++;
                var _g3 = 0;
                var _g2 = degreeV + 1;
                while (_g3 < _g2) {
                    var s = _g3++;
                    temp[s] = verb_core_Vec.zeros1d(dim);
                    var _g5 = 0;
                    var _g4 = degreeU + 1;
                    while (_g5 < _g4) {
                        var r = _g5++;
                        verb_core_Vec.addMulMutate(temp[s], uders[k][r], controlPoints[knotSpan_index_u - degreeU + r][knotSpan_index_v - degreeV + s]);
                    }
                }
                var nk = numDerivs - k;
                if (nk < dv)
                    dd = nk;
                else
                    dd = dv;
                var _g31 = 0;
                var _g21 = dd + 1;
                while (_g31 < _g21) {
                    var l = _g31++;
                    SKL[k][l] = verb_core_Vec.zeros1d(dim);
                    var _g51 = 0;
                    var _g41 = degreeV + 1;
                    while (_g51 < _g41) {
                        var s1 = _g51++;
                        verb_core_Vec.addMulMutate(SKL[k][l], vders[l][s1], temp[s1]);
                    }
                }
            }
            return SKL;
        };
        verb_eval_Eval.surfacePoint = function (surface, u, v) {
            var n = surface.knotsU.length - surface.degreeU - 2;
            var m = surface.knotsV.length - surface.degreeV - 2;
            return verb_eval_Eval.surfacePointGivenNM(n, m, surface, u, v);
        };
        verb_eval_Eval.surfacePointGivenNM = function (n, m, surface, u, v) {
            var degreeU = surface.degreeU;
            var degreeV = surface.degreeV;
            var controlPoints = surface.controlPoints;
            var knotsU = surface.knotsU;
            var knotsV = surface.knotsV;
            if (!verb_eval_Eval.areValidRelations(degreeU, controlPoints.length, knotsU.length) || !verb_eval_Eval.areValidRelations(degreeV, controlPoints[0].length, knotsV.length))
                throw new js__$Boot_HaxeError("Invalid relations between control points, knot vector, and n");
            var dim = controlPoints[0][0].length;
            var knotSpan_index_u = verb_eval_Eval.knotSpanGivenN(n, degreeU, u, knotsU);
            var knotSpan_index_v = verb_eval_Eval.knotSpanGivenN(m, degreeV, v, knotsV);
            var u_basis_vals = verb_eval_Eval.basisFunctionsGivenKnotSpanIndex(knotSpan_index_u, u, degreeU, knotsU);
            var v_basis_vals = verb_eval_Eval.basisFunctionsGivenKnotSpanIndex(knotSpan_index_v, v, degreeV, knotsV);
            var uind = knotSpan_index_u - degreeU;
            var vind = knotSpan_index_v;
            var position = verb_core_Vec.zeros1d(dim);
            var temp = verb_core_Vec.zeros1d(dim);
            var _g1 = 0;
            var _g = degreeV + 1;
            while (_g1 < _g) {
                var l = _g1++;
                temp = verb_core_Vec.zeros1d(dim);
                vind = knotSpan_index_v - degreeV + l;
                var _g3 = 0;
                var _g2 = degreeU + 1;
                while (_g3 < _g2) {
                    var k = _g3++;
                    verb_core_Vec.addMulMutate(temp, u_basis_vals[k], controlPoints[uind + k][vind]);
                }
                verb_core_Vec.addMulMutate(position, v_basis_vals[l], temp);
            }
            return position;
        };
        verb_eval_Eval.curveRegularSamplePoints = function (crv, divs) {
            var derivs = verb_eval_Eval.curveDerivatives(crv, crv.knots[0], crv.degree);
            var t = 1.0 / divs;
            var temp = t * t;
            var f = derivs[0];
            var fd = verb_core_Vec.mul(t, derivs[1]);
            var fdd_per2 = verb_core_Vec.mul(temp * 0.5, derivs[2]);
            var fddd_per2 = verb_core_Vec.mul(temp * t * 0.5, derivs[3]);
            var fdd = verb_core_Vec.add(fdd_per2, fdd_per2);
            var fddd = verb_core_Vec.add(fddd_per2, fddd_per2);
            var fddd_per6 = verb_core_Vec.mul(0.333333333333333315, fddd_per2);
            var pts = [];
            var _g1 = 0;
            var _g = divs + 1;
            while (_g1 < _g) {
                var i = _g1++;
                pts.push(verb_eval_Eval.dehomogenize(f));
                verb_core_Vec.addAllMutate([f, fd, fdd_per2, fddd_per6]);
                verb_core_Vec.addAllMutate([fd, fdd, fddd_per2]);
                verb_core_Vec.addAllMutate([fdd, fddd]);
                verb_core_Vec.addAllMutate([fdd_per2, fddd_per2]);
            }
            return pts;
        };
        verb_eval_Eval.curveRegularSamplePoints2 = function (crv, divs) {
            var derivs = verb_eval_Eval.curveDerivatives(crv, crv.knots[0], crv.degree);
            var t = 1.0 / divs;
            var temp = t * t;
            var f = derivs[0];
            var fd = verb_core_Vec.mul(t, derivs[1]);
            var fdd_per2 = verb_core_Vec.mul(temp * 0.5, derivs[2]);
            var fddd_per2 = verb_core_Vec.mul(temp * t * 0.5, derivs[3]);
            var fdd = verb_core_Vec.add(fdd_per2, fdd_per2);
            var fddd = verb_core_Vec.add(fddd_per2, fddd_per2);
            var fddd_per6 = verb_core_Vec.mul(0.333333333333333315, fddd_per2);
            var pts = [];
            var _g1 = 0;
            var _g = divs + 1;
            while (_g1 < _g) {
                var i = _g1++;
                pts.push(verb_eval_Eval.dehomogenize(f));
                verb_core_Vec.addAllMutate([f, fd, fdd_per2, fddd_per6]);
                verb_core_Vec.addAllMutate([fd, fdd, fddd_per2]);
                verb_core_Vec.addAllMutate([fdd, fddd]);
                verb_core_Vec.addAllMutate([fdd_per2, fddd_per2]);
            }
            return pts;
        };
        verb_eval_Eval.rationalSurfaceRegularSampleDerivatives = function (surface, divsU, divsV, numDerivs) {
            var allders = verb_eval_Eval.surfaceRegularSampleDerivatives(surface, divsU, divsV, numDerivs);
            var allratders = [];
            var divsU1 = divsU + 1;
            var divsV1 = divsV + 1;
            var numDerivs1 = numDerivs + 1;
            var _g = 0;
            while (_g < divsU1) {
                var i = _g++;
                var rowders = [];
                allratders.push(rowders);
                var _g1 = 0;
                while (_g1 < divsV1) {
                    var j = _g1++;
                    var ders = allders[i][j];
                    var Aders = verb_eval_Eval.rational2d(ders);
                    var wders = verb_eval_Eval.weight2d(ders);
                    var SKL = [];
                    var dim = Aders[0][0].length;
                    var _g2 = 0;
                    while (_g2 < numDerivs1) {
                        var k = _g2++;
                        SKL.push([]);
                        var _g4 = 0;
                        var _g3 = numDerivs1 - k;
                        while (_g4 < _g3) {
                            var l = _g4++;
                            var v = Aders[k][l];
                            var _g6 = 1;
                            var _g5 = l + 1;
                            while (_g6 < _g5) {
                                var j1 = _g6++;
                                verb_core_Vec.subMulMutate(v, verb_core_Binomial.get(l, j1) * wders[0][j1], SKL[k][l - j1]);
                            }
                            var _g61 = 1;
                            var _g51 = k + 1;
                            while (_g61 < _g51) {
                                var i1 = _g61++;
                                verb_core_Vec.subMulMutate(v, verb_core_Binomial.get(k, i1) * wders[i1][0], SKL[k - i1][l]);
                                var v2 = verb_core_Vec.zeros1d(dim);
                                var _g8 = 1;
                                var _g7 = l + 1;
                                while (_g8 < _g7) {
                                    var j2 = _g8++;
                                    verb_core_Vec.addMulMutate(v2, verb_core_Binomial.get(l, j2) * wders[i1][j2], SKL[k - i1][l - j2]);
                                }
                                verb_core_Vec.subMulMutate(v, verb_core_Binomial.get(k, i1), v2);
                            }
                            verb_core_Vec.mulMutate(1 / wders[0][0], v);
                            SKL[k].push(v);
                        }
                    }
                    rowders.push(SKL);
                }
            }
            return allratders;
        };
        verb_eval_Eval.surfaceRegularSampleDerivatives = function (surface, divsU, divsV, numDerivs) {
            var degreeU = surface.degreeU;
            var degreeV = surface.degreeV;
            var controlPoints = surface.controlPoints;
            var knotsU = surface.knotsU;
            var knotsV = surface.knotsV;
            var dim = controlPoints[0][0].length;
            var spanU = (verb_core_ArrayExtensions.last(knotsU) - knotsU[0]) / divsU;
            var spanV = (verb_core_ArrayExtensions.last(knotsV) - knotsV[0]) / divsV;
            var knotSpansBasesU = verb_eval_Eval.regularlySpacedDerivativeBasisFunctions(degreeU, knotsU, divsU);
            var knotSpansU = knotSpansBasesU.item0;
            var basesU = knotSpansBasesU.item1;
            var knotSpansBasesV = verb_eval_Eval.regularlySpacedDerivativeBasisFunctions(degreeV, knotsV, divsV);
            var knotSpansV = knotSpansBasesV.item0;
            var basesV = knotSpansBasesV.item1;
            var pts = [];
            var divsU1 = divsU + 1;
            var divsV1 = divsV + 1;
            var _g = 0;
            while (_g < divsU1) {
                var i = _g++;
                var ptsi = [];
                pts.push(ptsi);
                var _g1 = 0;
                while (_g1 < divsV1) {
                    var j = _g1++;
                    ptsi.push(verb_eval_Eval.surfaceDerivativesGivenBasesKnotSpans(degreeU, degreeV, controlPoints, knotSpansU[i], knotSpansV[j], basesU[i], basesV[j], dim, numDerivs));
                }
            }
            return pts;
        };
        verb_eval_Eval.rationalSurfaceRegularSamplePoints = function (surface, divsU, divsV) {
            return verb_eval_Eval.dehomogenize2d(verb_eval_Eval.surfaceRegularSamplePoints(surface, divsU, divsV));
        };
        verb_eval_Eval.surfaceRegularSamplePoints = function (surface, divsU, divsV) {
            var degreeU = surface.degreeU;
            var degreeV = surface.degreeV;
            var controlPoints = surface.controlPoints;
            var knotsU = surface.knotsU;
            var knotsV = surface.knotsV;
            var dim = controlPoints[0][0].length;
            var spanU = (verb_core_ArrayExtensions.last(knotsU) - knotsU[0]) / divsU;
            var spanV = (verb_core_ArrayExtensions.last(knotsV) - knotsV[0]) / divsV;
            var knotSpansBasesU = verb_eval_Eval.regularlySpacedBasisFunctions(degreeU, knotsU, divsU);
            var knotSpansU = knotSpansBasesU.item0;
            var basesU = knotSpansBasesU.item1;
            var knotSpansBasesV = verb_eval_Eval.regularlySpacedBasisFunctions(degreeV, knotsV, divsV);
            var knotSpansV = knotSpansBasesV.item0;
            var basesV = knotSpansBasesV.item1;
            var pts = [];
            var divsU1 = divsU + 1;
            var divsV1 = divsV + 1;
            var _g = 0;
            while (_g < divsU1) {
                var i = _g++;
                var ptsi = [];
                pts.push(ptsi);
                var _g1 = 0;
                while (_g1 < divsV1) {
                    var j = _g1++;
                    ptsi.push(verb_eval_Eval.surfacePointGivenBasesKnotSpans(degreeU, degreeV, controlPoints, knotSpansU[i], knotSpansV[j], basesU[i], basesV[j], dim));
                }
            }
            return pts;
        };
        verb_eval_Eval.regularlySpacedBasisFunctions = function (degree, knots, divs) {
            var n = knots.length - degree - 2;
            var span = (verb_core_ArrayExtensions.last(knots) - knots[0]) / divs;
            var bases = [];
            var knotspans = [];
            var u = knots[0];
            var knotIndex = verb_eval_Eval.knotSpanGivenN(n, degree, u, knots);
            var div1 = divs + 1;
            var _g = 0;
            while (_g < div1) {
                var i = _g++;
                while (u >= knots[knotIndex + 1])
                    knotIndex++;
                knotspans.push(knotIndex);
                bases.push(verb_eval_Eval.basisFunctionsGivenKnotSpanIndex(knotIndex, u, degree, knots));
                u += span;
            }
            return new verb_core_Pair(knotspans, bases);
        };
        verb_eval_Eval.regularlySpacedDerivativeBasisFunctions = function (degree, knots, divs) {
            var n = knots.length - degree - 2;
            var span = (verb_core_ArrayExtensions.last(knots) - knots[0]) / divs;
            var bases = [];
            var knotspans = [];
            var u = knots[0];
            var knotIndex = verb_eval_Eval.knotSpanGivenN(n, degree, u, knots);
            var div1 = divs + 1;
            var _g = 0;
            while (_g < div1) {
                var i = _g++;
                while (u >= knots[knotIndex + 1])
                    knotIndex++;
                knotspans.push(knotIndex);
                bases.push(verb_eval_Eval.derivativeBasisFunctionsGivenNI(knotIndex, u, degree, n, knots));
                u += span;
            }
            return new verb_core_Pair(knotspans, bases);
        };
        verb_eval_Eval.surfacePointGivenBasesKnotSpans = function (degreeU, degreeV, controlPoints, knotSpanU, knotSpanV, basesU, basesV, dim) {
            var position = verb_core_Vec.zeros1d(dim);
            var temp;
            var uind = knotSpanU - degreeU;
            var vind = knotSpanV - degreeV;
            var _g1 = 0;
            var _g = degreeV + 1;
            while (_g1 < _g) {
                var l = _g1++;
                temp = verb_core_Vec.zeros1d(dim);
                var _g3 = 0;
                var _g2 = degreeU + 1;
                while (_g3 < _g2) {
                    var k = _g3++;
                    verb_core_Vec.addMulMutate(temp, basesU[k], controlPoints[uind + k][vind]);
                }
                vind++;
                verb_core_Vec.addMulMutate(position, basesV[l], temp);
            }
            return position;
        };
        verb_eval_Eval.surfaceDerivativesGivenBasesKnotSpans = function (degreeU, degreeV, controlPoints, knotSpanU, knotSpanV, basesU, basesV, dim, numDerivs) {
            var dim1 = controlPoints[0][0].length;
            var du;
            if (numDerivs < degreeU)
                du = numDerivs;
            else
                du = degreeU;
            var dv;
            if (numDerivs < degreeV)
                dv = numDerivs;
            else
                dv = degreeV;
            var SKL = verb_core_Vec.zeros3d(du + 1, dv + 1, dim1);
            var temp = verb_core_Vec.zeros2d(degreeV + 1, dim1);
            var dd = 0;
            var _g1 = 0;
            var _g = du + 1;
            while (_g1 < _g) {
                var k = _g1++;
                var _g3 = 0;
                var _g2 = degreeV + 1;
                while (_g3 < _g2) {
                    var s = _g3++;
                    temp[s] = verb_core_Vec.zeros1d(dim1);
                    var _g5 = 0;
                    var _g4 = degreeU + 1;
                    while (_g5 < _g4) {
                        var r = _g5++;
                        verb_core_Vec.addMulMutate(temp[s], basesU[k][r], controlPoints[knotSpanU - degreeU + r][knotSpanV - degreeV + s]);
                    }
                }
                var nk = numDerivs - k;
                if (nk < dv)
                    dd = nk;
                else
                    dd = dv;
                var _g31 = 0;
                var _g21 = dd + 1;
                while (_g31 < _g21) {
                    var l = _g31++;
                    SKL[k][l] = verb_core_Vec.zeros1d(dim1);
                    var _g51 = 0;
                    var _g41 = degreeV + 1;
                    while (_g51 < _g41) {
                        var s1 = _g51++;
                        verb_core_Vec.addMulMutate(SKL[k][l], basesV[l][s1], temp[s1]);
                    }
                }
            }
            return SKL;
        };
        verb_eval_Eval.curveDerivatives = function (crv, u, numDerivs) {
            var n = crv.knots.length - crv.degree - 2;
            return verb_eval_Eval.curveDerivativesGivenN(n, crv, u, numDerivs);
        };
        verb_eval_Eval.curveDerivativesGivenN = function (n, curve, u, numDerivs) {
            var degree = curve.degree;
            var controlPoints = curve.controlPoints;
            var knots = curve.knots;
            if (!verb_eval_Eval.areValidRelations(degree, controlPoints.length, knots.length))
                throw new js__$Boot_HaxeError("Invalid relations between control points, knot vector, and n");
            var dim = controlPoints[0].length;
            var du;
            if (numDerivs < degree)
                du = numDerivs;
            else
                du = degree;
            var CK = verb_core_Vec.zeros2d(numDerivs + 1, dim);
            var knotSpan_index = verb_eval_Eval.knotSpanGivenN(n, degree, u, knots);
            var nders = verb_eval_Eval.derivativeBasisFunctionsGivenNI(knotSpan_index, u, degree, du, knots);
            var k = 0;
            var j = 0;
            var _g1 = 0;
            var _g = du + 1;
            while (_g1 < _g) {
                var k1 = _g1++;
                var _g3 = 0;
                var _g2 = degree + 1;
                while (_g3 < _g2) {
                    var j1 = _g3++;
                    verb_core_Vec.addMulMutate(CK[k1], nders[k1][j1], controlPoints[knotSpan_index - degree + j1]);
                }
            }
            return CK;
        };
        verb_eval_Eval.curvePoint = function (curve, u) {
            var n = curve.knots.length - curve.degree - 2;
            return verb_eval_Eval.curvePointGivenN(n, curve, u);
        };
        verb_eval_Eval.areValidRelations = function (degree, num_controlPoints, knots_length) {
            return num_controlPoints + degree + 1 - knots_length == 0;
        };
        verb_eval_Eval.curvePointGivenN = function (n, curve, u) {
            var degree = curve.degree;
            var controlPoints = curve.controlPoints;
            var knots = curve.knots;
            if (!verb_eval_Eval.areValidRelations(degree, controlPoints.length, knots.length)) {
                throw new js__$Boot_HaxeError("Invalid relations between control points, knot Array, and n");
                return null;
            }
            var knotSpan_index = verb_eval_Eval.knotSpanGivenN(n, degree, u, knots);
            var basis_values = verb_eval_Eval.basisFunctionsGivenKnotSpanIndex(knotSpan_index, u, degree, knots);
            var position = verb_core_Vec.zeros1d(controlPoints[0].length);
            var _g1 = 0;
            var _g = degree + 1;
            while (_g1 < _g) {
                var j = _g1++;
                verb_core_Vec.addMulMutate(position, basis_values[j], controlPoints[knotSpan_index - degree + j]);
            }
            return position;
        };
        verb_eval_Eval.volumePoint = function (volume, u, v, w) {
            var n = volume.knotsU.length - volume.degreeU - 2;
            var m = volume.knotsV.length - volume.degreeV - 2;
            var l = volume.knotsW.length - volume.degreeW - 2;
            return verb_eval_Eval.volumePointGivenNML(volume, n, m, l, u, v, w);
        };
        verb_eval_Eval.volumePointGivenNML = function (volume, n, m, l, u, v, w) {
            if (!verb_eval_Eval.areValidRelations(volume.degreeU, volume.controlPoints.length, volume.knotsU.length) || !verb_eval_Eval.areValidRelations(volume.degreeV, volume.controlPoints[0].length, volume.knotsV.length) || !verb_eval_Eval.areValidRelations(volume.degreeW, volume.controlPoints[0][0].length, volume.knotsW.length))
                throw new js__$Boot_HaxeError("Invalid relations between control points and knot vector");
            var controlPoints = volume.controlPoints;
            var degreeU = volume.degreeU;
            var degreeV = volume.degreeV;
            var degreeW = volume.degreeW;
            var knotsU = volume.knotsU;
            var knotsV = volume.knotsV;
            var knotsW = volume.knotsW;
            var dim = controlPoints[0][0][0].length;
            var knotSpan_index_u = verb_eval_Eval.knotSpanGivenN(n, degreeU, u, knotsU);
            var knotSpan_index_v = verb_eval_Eval.knotSpanGivenN(m, degreeV, v, knotsV);
            var knotSpan_index_w = verb_eval_Eval.knotSpanGivenN(l, degreeW, w, knotsW);
            var u_basis_vals = verb_eval_Eval.basisFunctionsGivenKnotSpanIndex(knotSpan_index_u, u, degreeU, knotsU);
            var v_basis_vals = verb_eval_Eval.basisFunctionsGivenKnotSpanIndex(knotSpan_index_v, v, degreeV, knotsV);
            var w_basis_vals = verb_eval_Eval.basisFunctionsGivenKnotSpanIndex(knotSpan_index_w, w, degreeW, knotsW);
            var uind = knotSpan_index_u - degreeU;
            var position = verb_core_Vec.zeros1d(dim);
            var temp = verb_core_Vec.zeros1d(dim);
            var temp2 = verb_core_Vec.zeros1d(dim);
            var _g1 = 0;
            var _g = degreeW + 1;
            while (_g1 < _g) {
                var i = _g1++;
                temp2 = verb_core_Vec.zeros1d(dim);
                var wind = knotSpan_index_w - degreeW + i;
                var _g3 = 0;
                var _g2 = degreeV + 1;
                while (_g3 < _g2) {
                    var j = _g3++;
                    temp = verb_core_Vec.zeros1d(dim);
                    var vind = knotSpan_index_v - degreeV + j;
                    var _g5 = 0;
                    var _g4 = degreeU + 1;
                    while (_g5 < _g4) {
                        var k = _g5++;
                        verb_core_Vec.addMulMutate(temp, u_basis_vals[k], controlPoints[uind + k][vind][wind]);
                    }
                    verb_core_Vec.addMulMutate(temp2, v_basis_vals[j], temp);
                }
                verb_core_Vec.addMulMutate(position, w_basis_vals[i], temp2);
            }
            return position;
        };
        verb_eval_Eval.derivativeBasisFunctions = function (u, degree, knots) {
            var knotSpan_index = verb_eval_Eval.knotSpan(degree, u, knots);
            var m = knots.length - 1;
            var n = m - degree - 1;
            return verb_eval_Eval.derivativeBasisFunctionsGivenNI(knotSpan_index, u, degree, n, knots);
        };
        verb_eval_Eval.derivativeBasisFunctionsGivenNI = function (knotIndex, u, p, n, knots) {
            var ndu = verb_core_Vec.zeros2d(p + 1, p + 1);
            var left = verb_core_Vec.zeros1d(p + 1);
            var right = verb_core_Vec.zeros1d(p + 1);
            var saved = 0.0;
            var temp = 0.0;
            ndu[0][0] = 1.0;
            var _g1 = 1;
            var _g = p + 1;
            while (_g1 < _g) {
                var j = _g1++;
                left[j] = u - knots[knotIndex + 1 - j];
                right[j] = knots[knotIndex + j] - u;
                saved = 0.0;
                var _g2 = 0;
                while (_g2 < j) {
                    var r = _g2++;
                    ndu[j][r] = right[r + 1] + left[j - r];
                    temp = ndu[r][j - 1] / ndu[j][r];
                    ndu[r][j] = saved + right[r + 1] * temp;
                    saved = left[j - r] * temp;
                }
                ndu[j][j] = saved;
            }
            var ders = verb_core_Vec.zeros2d(n + 1, p + 1);
            var a = verb_core_Vec.zeros2d(2, p + 1);
            var s1 = 0;
            var s2 = 1;
            var d = 0.0;
            var rk = 0;
            var pk = 0;
            var j1 = 0;
            var j2 = 0;
            var _g11 = 0;
            var _g3 = p + 1;
            while (_g11 < _g3) {
                var j3 = _g11++;
                ders[0][j3] = ndu[j3][p];
            }
            var _g12 = 0;
            var _g4 = p + 1;
            while (_g12 < _g4) {
                var r1 = _g12++;
                s1 = 0;
                s2 = 1;
                a[0][0] = 1.0;
                var _g31 = 1;
                var _g21 = n + 1;
                while (_g31 < _g21) {
                    var k = _g31++;
                    d = 0.0;
                    rk = r1 - k;
                    pk = p - k;
                    if (r1 >= k) {
                        a[s2][0] = a[s1][0] / ndu[pk + 1][rk];
                        d = a[s2][0] * ndu[rk][pk];
                    }
                    if (rk >= -1)
                        j1 = 1;
                    else
                        j1 = -rk;
                    if (r1 - 1 <= pk)
                        j2 = k - 1;
                    else
                        j2 = p - r1;
                    var _g5 = j1;
                    var _g41 = j2 + 1;
                    while (_g5 < _g41) {
                        var j4 = _g5++;
                        a[s2][j4] = (a[s1][j4] - a[s1][j4 - 1]) / ndu[pk + 1][rk + j4];
                        d += a[s2][j4] * ndu[rk + j4][pk];
                    }
                    if (r1 <= pk) {
                        a[s2][k] = -a[s1][k - 1] / ndu[pk + 1][r1];
                        d += a[s2][k] * ndu[r1][pk];
                    }
                    ders[k][r1] = d;
                    var temp1 = s1;
                    s1 = s2;
                    s2 = temp1;
                }
            }
            var acc = p;
            var _g13 = 1;
            var _g6 = n + 1;
            while (_g13 < _g6) {
                var k1 = _g13++;
                var _g32 = 0;
                var _g22 = p + 1;
                while (_g32 < _g22) {
                    var j5 = _g32++;
                    ders[k1][j5] *= acc;
                }
                acc *= p - k1;
            }
            return ders;
        };
        verb_eval_Eval.basisFunctions = function (u, degree, knots) {
            var knotSpan_index = verb_eval_Eval.knotSpan(degree, u, knots);
            return verb_eval_Eval.basisFunctionsGivenKnotSpanIndex(knotSpan_index, u, degree, knots);
        };
        verb_eval_Eval.basisFunctionsGivenKnotSpanIndex = function (knotSpan_index, u, degree, knots) {
            var basisFunctions = verb_core_Vec.zeros1d(degree + 1);
            var left = verb_core_Vec.zeros1d(degree + 1);
            var right = verb_core_Vec.zeros1d(degree + 1);
            var saved = 0;
            var temp = 0;
            basisFunctions[0] = 1.0;
            var _g1 = 1;
            var _g = degree + 1;
            while (_g1 < _g) {
                var j = _g1++;
                left[j] = u - knots[knotSpan_index + 1 - j];
                right[j] = knots[knotSpan_index + j] - u;
                saved = 0.0;
                var _g2 = 0;
                while (_g2 < j) {
                    var r = _g2++;
                    temp = basisFunctions[r] / (right[r + 1] + left[j - r]);
                    basisFunctions[r] = saved + right[r + 1] * temp;
                    saved = left[j - r] * temp;
                }
                basisFunctions[j] = saved;
            }
            return basisFunctions;
        };
        verb_eval_Eval.knotSpan = function (degree, u, knots) {
            return verb_eval_Eval.knotSpanGivenN(knots.length - degree - 2, degree, u, knots);
        };
        verb_eval_Eval.knotSpanGivenN = function (n, degree, u, knots) {
            if (u > knots[n + 1] - verb_core_Constants.EPSILON)
                return n;
            if (u < knots[degree] + verb_core_Constants.EPSILON)
                return degree;
            var low = degree;
            var high = n + 1;
            var mid = Math.floor((low + high) / 2);
            while (u < knots[mid] || u >= knots[mid + 1]) {
                if (u < knots[mid])
                    high = mid;
                else
                    low = mid;
                mid = Math.floor((low + high) / 2);
            }
            return mid;
        };
        verb_eval_Eval.dehomogenize = function (homoPoint) {
            var dim = homoPoint.length;
            var point = [];
            var wt = homoPoint[dim - 1];
            var l = homoPoint.length - 1;
            var _g = 0;
            while (_g < l) {
                var i = _g++;
                point.push(homoPoint[i] / wt);
            }
            return point;
        };
        verb_eval_Eval.rational1d = function (homoPoints) {
            var dim = homoPoints[0].length - 1;
            return homoPoints.map(function (x) {
                return x.slice(0, dim);
            });
        };
        verb_eval_Eval.rational2d = function (homoPoints) {
            return homoPoints.map(verb_eval_Eval.rational1d);
        };
        verb_eval_Eval.weight1d = function (homoPoints) {
            var dim = homoPoints[0].length - 1;
            return homoPoints.map(function (x) {
                return x[dim];
            });
        };
        verb_eval_Eval.weight2d = function (homoPoints) {
            return homoPoints.map(verb_eval_Eval.weight1d);
        };
        verb_eval_Eval.dehomogenize1d = function (homoPoints) {
            return homoPoints.map(verb_eval_Eval.dehomogenize);
        };
        verb_eval_Eval.dehomogenize2d = function (homoPoints) {
            return homoPoints.map(verb_eval_Eval.dehomogenize1d);
        };
        verb_eval_Eval.homogenize1d = function (controlPoints, weights) {
            var rows = controlPoints.length;
            var dim = controlPoints[0].length;
            var homo_controlPoints = [];
            var wt = 0.0;
            var ref_pt = [];
            var weights1;
            if (weights != null)
                weights1 = weights;
            else
                weights1 = verb_core_Vec.rep(controlPoints.length, 1.0);
            var _g = 0;
            while (_g < rows) {
                var i = _g++;
                var pt = [];
                ref_pt = controlPoints[i];
                wt = weights1[i];
                var _g1 = 0;
                while (_g1 < dim) {
                    var k = _g1++;
                    pt.push(ref_pt[k] * wt);
                }
                pt.push(wt);
                homo_controlPoints.push(pt);
            }
            return homo_controlPoints;
        };
        verb_eval_Eval.homogenize2d = function (controlPoints, weights) {
            var rows = controlPoints.length;
            var homo_controlPoints = [];
            var weights1;
            if (weights != null)
                weights1 = weights;
            else {
                var _g = [];
                var _g1 = 0;
                while (_g1 < rows) {
                    var i = _g1++;
                    _g.push(verb_core_Vec.rep(controlPoints[0].length, 1.0));
                }
                weights1 = _g;
            }
            var _g11 = 0;
            while (_g11 < rows) {
                var i1 = _g11++;
                homo_controlPoints.push(verb_eval_Eval.homogenize1d(controlPoints[i1], weights1[i1]));
            }
            return homo_controlPoints;
        };
        var verb_eval_Intersect = $hx_exports.eval.Intersect = function () { };
        $hxClasses["verb.eval.Intersect"] = verb_eval_Intersect;
        verb_eval_Intersect.__name__ = ["verb", "eval", "Intersect"];
        verb_eval_Intersect.surfaces = function (surface0, surface1, tol) {
            var tess1 = verb_eval_Tess.rationalSurfaceAdaptive(surface0);
            var tess2 = verb_eval_Tess.rationalSurfaceAdaptive(surface1);
            var resApprox = verb_eval_Intersect.meshes(tess1, tess2);
            var exactPls = resApprox.map(function (pl) {
                return pl.map(function (inter) {
                    return verb_eval_Intersect.surfacesAtPointWithEstimate(surface0, surface1, inter.uv0, inter.uv1, tol);
                });
            });
            return exactPls.map(function (x) {
                return verb_eval_Make.rationalInterpCurve(x.map(function (y) {
                    return y.point;
                }), 3);
            });
        };
        verb_eval_Intersect.surfacesAtPointWithEstimate = function (surface0, surface1, uv1, uv2, tol) {
            var pds;
            var p;
            var pn;
            var pu;
            var pv;
            var pd;
            var qds;
            var q;
            var qn;
            var qu;
            var qv;
            var qd;
            var dist;
            var maxits = 5;
            var its = 0;
            do {
                pds = verb_eval_Eval.rationalSurfaceDerivatives(surface0, uv1[0], uv1[1], 1);
                p = pds[0][0];
                pu = pds[1][0];
                pv = pds[0][1];
                pn = verb_core_Vec.normalized(verb_core_Vec.cross(pu, pv));
                pd = verb_core_Vec.dot(pn, p);
                qds = verb_eval_Eval.rationalSurfaceDerivatives(surface1, uv2[0], uv2[1], 1);
                q = qds[0][0];
                qu = qds[1][0];
                qv = qds[0][1];
                qn = verb_core_Vec.normalized(verb_core_Vec.cross(qu, qv));
                qd = verb_core_Vec.dot(qn, q);
                dist = verb_core_Vec.distSquared(p, q);
                if (dist < tol * tol)
                    break;
                var fn = verb_core_Vec.normalized(verb_core_Vec.cross(pn, qn));
                var fd = verb_core_Vec.dot(fn, p);
                var x = verb_eval_Intersect.threePlanes(pn, pd, qn, qd, fn, fd);
                if (x == null)
                    throw new js__$Boot_HaxeError("panic!");
                var pdif = verb_core_Vec.sub(x, p);
                var qdif = verb_core_Vec.sub(x, q);
                var rw = verb_core_Vec.cross(pu, pn);
                var rt = verb_core_Vec.cross(pv, pn);
                var su = verb_core_Vec.cross(qu, qn);
                var sv = verb_core_Vec.cross(qv, qn);
                var dw = verb_core_Vec.dot(rt, pdif) / verb_core_Vec.dot(rt, pu);
                var dt = verb_core_Vec.dot(rw, pdif) / verb_core_Vec.dot(rw, pv);
                var du = verb_core_Vec.dot(sv, qdif) / verb_core_Vec.dot(sv, qu);
                var dv = verb_core_Vec.dot(su, qdif) / verb_core_Vec.dot(su, qv);
                uv1 = verb_core_Vec.add([dw, dt], uv1);
                uv2 = verb_core_Vec.add([du, dv], uv2);
                its++;
            } while (its < maxits);
            return new verb_core_SurfaceSurfaceIntersectionPoint(uv1, uv2, p, dist);
        };
        verb_eval_Intersect.meshes = function (mesh0, mesh1, bbtree0, bbtree1) {
            if (bbtree0 == null)
                bbtree0 = new verb_core_LazyMeshBoundingBoxTree(mesh0);
            if (bbtree1 == null)
                bbtree1 = new verb_core_LazyMeshBoundingBoxTree(mesh1);
            var bbints = verb_eval_Intersect.boundingBoxTrees(bbtree0, bbtree1, 0);
            var segments = verb_core_ArrayExtensions.unique(bbints.map(function (ids) {
                return verb_eval_Intersect.triangles(mesh0, ids.item0, mesh1, ids.item1);
            }).filter(function (x) {
                return x != null;
            }).filter(function (x1) {
                return verb_core_Vec.distSquared(x1.min.point, x1.max.point) > verb_core_Constants.EPSILON;
            }), function (a, b) {
                var s1 = verb_core_Vec.sub(a.min.uv0, b.min.uv0);
                var d1 = verb_core_Vec.dot(s1, s1);
                var s2 = verb_core_Vec.sub(a.max.uv0, b.max.uv0);
                var d2 = verb_core_Vec.dot(s2, s2);
                var s3 = verb_core_Vec.sub(a.min.uv0, b.max.uv0);
                var d3 = verb_core_Vec.dot(s3, s3);
                var s4 = verb_core_Vec.sub(a.max.uv0, b.min.uv0);
                var d4 = verb_core_Vec.dot(s4, s4);
                return d1 < verb_core_Constants.EPSILON && d2 < verb_core_Constants.EPSILON || d3 < verb_core_Constants.EPSILON && d4 < verb_core_Constants.EPSILON;
            });
            return verb_eval_Intersect.makeMeshIntersectionPolylines(segments);
        };
        verb_eval_Intersect.meshSlices = function (mesh, min, max, step) {
            var bbtree = new verb_core_MeshBoundingBoxTree(mesh);
            var bb = bbtree.boundingBox();
            var x0 = bb.min[0];
            var y0 = bb.min[1];
            var x1 = bb.max[0];
            var y1 = bb.max[1];
            var span = verb_core_Vec.span(min, max, step);
            var slices = [];
            var _g = 0;
            while (_g < span.length) {
                var z = span[_g];
                ++_g;
                var pts = [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]];
                var uvs = [[0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0]];
                var faces = [[0, 1, 2], [0, 2, 3]];
                var plane = new verb_core_MeshData(faces, pts, null, uvs);
                slices.push(verb_eval_Intersect.meshes(mesh, plane, bbtree));
            }
            return slices;
        };
        verb_eval_Intersect.makeMeshIntersectionPolylines = function (segments) {
            if (segments.length == 0)
                return [];
            var _g = 0;
            while (_g < segments.length) {
                var s = segments[_g];
                ++_g;
                s.max.opp = s.min;
                s.min.opp = s.max;
            }
            var tree = verb_eval_Intersect.kdTreeFromSegments(segments);
            var ends = [];
            var _g1 = 0;
            while (_g1 < segments.length) {
                var seg = segments[_g1];
                ++_g1;
                ends.push(seg.min);
                ends.push(seg.max);
            }
            var _g2 = 0;
            while (_g2 < ends.length) {
                var segEnd = ends[_g2];
                ++_g2;
                if (segEnd.adj != null)
                    continue;
                var adjEnd = verb_eval_Intersect.lookupAdjacentSegment(segEnd, tree, segments.length);
                if (adjEnd != null && adjEnd.adj == null) {
                    segEnd.adj = adjEnd;
                    adjEnd.adj = segEnd;
                }
            }
            var freeEnds = ends.filter(function (x) {
                return x.adj == null;
            });
            if (freeEnds.length == 0)
                freeEnds = ends;
            var pls = [];
            var numVisitedEnds = 0;
            var loopDetected = false;
            while (freeEnds.length != 0) {
                var end = freeEnds.pop();
                if (!end.visited) {
                    var pl = [];
                    var curEnd = end;
                    while (curEnd != null) {
                        if (curEnd.visited)
                            break;
                        curEnd.visited = true;
                        curEnd.opp.visited = true;
                        pl.push(curEnd);
                        numVisitedEnds += 2;
                        curEnd = curEnd.opp.adj;
                        if (curEnd == end)
                            break;
                    }
                    if (pl.length > 0) {
                        pl.push(pl[pl.length - 1].opp);
                        pls.push(pl);
                    }
                }
                if (freeEnds.length == 0 && ends.length > 0 && (loopDetected || numVisitedEnds < ends.length)) {
                    loopDetected = true;
                    var e = ends.pop();
                    freeEnds.push(e);
                }
            }
            return pls;
        };
        verb_eval_Intersect.kdTreeFromSegments = function (segments) {
            var treePoints = [];
            var _g = 0;
            while (_g < segments.length) {
                var seg = segments[_g];
                ++_g;
                treePoints.push(new verb_core_KdPoint(seg.min.point, seg.min));
                treePoints.push(new verb_core_KdPoint(seg.max.point, seg.max));
            }
            return new verb_core_KdTree(treePoints, verb_core_Vec.distSquared);
        };
        verb_eval_Intersect.lookupAdjacentSegment = function (segEnd, tree, numResults) {
            var adj = tree.nearest(segEnd.point, numResults, verb_core_Constants.EPSILON).filter(function (r) {
                return segEnd != r.item0.obj;
            }).map(function (r1) {
                return r1.item0.obj;
            });
            if (adj.length == 1)
                return adj[0];
            else
                return null;
        };
        verb_eval_Intersect.curveAndSurface = function (curve, surface, tol, crvBbTree, srfBbTree) {
            if (tol == null)
                tol = 1e-3;
            if (crvBbTree != null)
                crvBbTree = crvBbTree;
            else
                crvBbTree = new verb_core_LazyCurveBoundingBoxTree(curve);
            if (srfBbTree != null)
                srfBbTree = srfBbTree;
            else
                srfBbTree = new verb_core_LazySurfaceBoundingBoxTree(surface);
            var ints = verb_eval_Intersect.boundingBoxTrees(crvBbTree, srfBbTree, tol);
            return verb_core_ArrayExtensions.unique(ints.map(function (inter) {
                var crvSeg = inter.item0;
                var srfPart = inter.item1;
                var min = verb_core_ArrayExtensions.first(crvSeg.knots);
                var max = verb_core_ArrayExtensions.last(crvSeg.knots);
                var u = (min + max) / 2.0;
                var minu = verb_core_ArrayExtensions.first(srfPart.knotsU);
                var maxu = verb_core_ArrayExtensions.last(srfPart.knotsU);
                var minv = verb_core_ArrayExtensions.first(srfPart.knotsV);
                var maxv = verb_core_ArrayExtensions.last(srfPart.knotsV);
                var uv = [(minu + maxu) / 2.0, (minv + maxv) / 2.0];
                return verb_eval_Intersect.curveAndSurfaceWithEstimate(crvSeg, srfPart, [u].concat(uv), tol);
            }).filter(function (x) {
                return verb_core_Vec.distSquared(x.curvePoint, x.surfacePoint) < tol * tol;
            }), function (a, b) {
                return Math.abs(a.u - b.u) < 0.5 * tol;
            });
        };
        verb_eval_Intersect.curveAndSurfaceWithEstimate = function (curve, surface, start_params, tol) {
            if (tol == null)
                tol = 1e-3;
            var objective = function (x) {
                var p1 = verb_eval_Eval.rationalCurvePoint(curve, x[0]);
                var p2 = verb_eval_Eval.rationalSurfacePoint(surface, x[1], x[2]);
                var p1_p2 = verb_core_Vec.sub(p1, p2);
                return verb_core_Vec.dot(p1_p2, p1_p2);
            };
            var grad = function (x1) {
                var dc = verb_eval_Eval.rationalCurveDerivatives(curve, x1[0], 1);
                var ds = verb_eval_Eval.rationalSurfaceDerivatives(surface, x1[1], x1[2], 1);
                var r = verb_core_Vec.sub(ds[0][0], dc[0]);
                var drdt = verb_core_Vec.mul(-1.0, dc[1]);
                var drdu = ds[1][0];
                var drdv = ds[0][1];
                return [2.0 * verb_core_Vec.dot(drdt, r), 2.0 * verb_core_Vec.dot(drdu, r), 2.0 * verb_core_Vec.dot(drdv, r)];
            };
            var sol_obj = verb_core_Minimizer.uncmin(objective, start_params, tol * tol, grad);
            var $final = sol_obj.solution;
            return new verb_core_CurveSurfaceIntersection($final[0], [$final[1], $final[2]], verb_eval_Eval.rationalCurvePoint(curve, $final[0]), verb_eval_Eval.rationalSurfacePoint(surface, $final[1], $final[2]));
        };
        verb_eval_Intersect.polylineAndMesh = function (polyline, mesh, tol) {
            var res = verb_eval_Intersect.boundingBoxTrees(new verb_core_LazyPolylineBoundingBoxTree(polyline), new verb_core_LazyMeshBoundingBoxTree(mesh), tol);
            var finalResults = [];
            var _g = 0;
            while (_g < res.length) {
                var event = res[_g];
                ++_g;
                var polid = event.item0;
                var faceid = event.item1;
                var inter = verb_eval_Intersect.segmentWithTriangle(polyline.points[polid], polyline.points[polid + 1], mesh.points, mesh.faces[faceid]);
                if (inter == null)
                    continue;
                var pt = inter.point;
                var u = verb_core_Vec.lerp(inter.p, [polyline.params[polid]], [polyline.params[polid + 1]])[0];
                var uv = verb_core_Mesh.triangleUVFromPoint(mesh, faceid, pt);
                finalResults.push(new verb_core_PolylineMeshIntersection(pt, u, uv, polid, faceid));
            }
            return finalResults;
        };
        verb_eval_Intersect.boundingBoxTrees = function (ai, bi, tol) {
            if (tol == null)
                tol = 1e-9;
            var atrees = [];
            var btrees = [];
            atrees.push(ai);
            btrees.push(bi);
            var results = [];
            while (atrees.length > 0) {
                var a = atrees.pop();
                var b = btrees.pop();
                if (a.empty() || b.empty())
                    continue;
                if (!a.boundingBox().intersects(b.boundingBox(), tol))
                    continue;
                var ai1 = a.indivisible(tol);
                var bi1 = b.indivisible(tol);
                if (ai1 && bi1) {
                    results.push(new verb_core_Pair(a["yield"](), b["yield"]()));
                    continue;
                }
                else if (ai1 && !bi1) {
                    var bs1 = b.split();
                    atrees.push(a);
                    btrees.push(bs1.item1);
                    atrees.push(a);
                    btrees.push(bs1.item0);
                    continue;
                }
                else if (!ai1 && bi1) {
                    var as1 = a.split();
                    atrees.push(as1.item1);
                    btrees.push(b);
                    atrees.push(as1.item0);
                    btrees.push(b);
                    continue;
                }
                var $as = a.split();
                var bs = b.split();
                atrees.push($as.item1);
                btrees.push(bs.item1);
                atrees.push($as.item1);
                btrees.push(bs.item0);
                atrees.push($as.item0);
                btrees.push(bs.item1);
                atrees.push($as.item0);
                btrees.push(bs.item0);
            }
            return results;
        };
        verb_eval_Intersect.curves = function (curve1, curve2, tolerance) {
            var ints = verb_eval_Intersect.boundingBoxTrees(new verb_core_LazyCurveBoundingBoxTree(curve1), new verb_core_LazyCurveBoundingBoxTree(curve2), 0);
            return verb_core_ArrayExtensions.unique(ints.map(function (x) {
                return verb_eval_Intersect.curvesWithEstimate(curve1, curve2, verb_core_ArrayExtensions.first(x.item0.knots), verb_core_ArrayExtensions.first(x.item1.knots), tolerance);
            }).filter(function (x1) {
                return verb_core_Vec.distSquared(x1.point0, x1.point1) < tolerance;
            }), function (a, b) {
                return Math.abs(a.u0 - b.u0) < tolerance * 5;
            });
        };
        verb_eval_Intersect.curvesWithEstimate = function (curve0, curve1, u0, u1, tolerance) {
            var objective = function (x) {
                var p1 = verb_eval_Eval.rationalCurvePoint(curve0, x[0]);
                var p2 = verb_eval_Eval.rationalCurvePoint(curve1, x[1]);
                var p1_p2 = verb_core_Vec.sub(p1, p2);
                return verb_core_Vec.dot(p1_p2, p1_p2);
            };
            var grad = function (x1) {
                var dc0 = verb_eval_Eval.rationalCurveDerivatives(curve0, x1[0], 1);
                var dc1 = verb_eval_Eval.rationalCurveDerivatives(curve1, x1[1], 1);
                var r = verb_core_Vec.sub(dc0[0], dc1[0]);
                var drdu = dc0[1];
                var drdt = verb_core_Vec.mul(-1.0, dc1[1]);
                return [2.0 * verb_core_Vec.dot(drdu, r), 2.0 * verb_core_Vec.dot(drdt, r)];
            };
            var sol_obj = verb_core_Minimizer.uncmin(objective, [u0, u1], tolerance * tolerance, grad);
            var u11 = sol_obj.solution[0];
            var u2 = sol_obj.solution[1];
            var p11 = verb_eval_Eval.rationalCurvePoint(curve0, u11);
            var p21 = verb_eval_Eval.rationalCurvePoint(curve1, u2);
            return new verb_core_CurveCurveIntersection(p11, p21, u11, u2);
        };
        verb_eval_Intersect.triangles = function (mesh0, faceIndex0, mesh1, faceIndex1) {
            var tri0 = mesh0.faces[faceIndex0];
            var tri1 = mesh1.faces[faceIndex1];
            var n0 = verb_core_Mesh.getTriangleNorm(mesh0.points, tri0);
            var n1 = verb_core_Mesh.getTriangleNorm(mesh1.points, tri1);
            var o0 = mesh0.points[tri0[0]];
            var o1 = mesh1.points[tri1[0]];
            var ray = verb_eval_Intersect.planes(o0, n0, o1, n1);
            if (ray == null)
                return null;
            var clip1 = verb_eval_Intersect.clipRayInCoplanarTriangle(ray, mesh0, faceIndex0);
            if (clip1 == null)
                return null;
            var clip2 = verb_eval_Intersect.clipRayInCoplanarTriangle(ray, mesh1, faceIndex1);
            if (clip2 == null)
                return null;
            var merged = verb_eval_Intersect.mergeTriangleClipIntervals(clip1, clip2, mesh0, faceIndex0, mesh1, faceIndex1);
            if (merged == null)
                return null;
            return new verb_core_Interval(new verb_core_MeshIntersectionPoint(merged.min.uv0, merged.min.uv1, merged.min.point, faceIndex0, faceIndex1), new verb_core_MeshIntersectionPoint(merged.max.uv0, merged.max.uv1, merged.max.point, faceIndex0, faceIndex1));
        };
        verb_eval_Intersect.clipRayInCoplanarTriangle = function (ray, mesh, faceIndex) {
            var tri = mesh.faces[faceIndex];
            var o = [mesh.points[tri[0]], mesh.points[tri[1]], mesh.points[tri[2]]];
            var uvs = [mesh.uvs[tri[0]], mesh.uvs[tri[1]], mesh.uvs[tri[2]]];
            var uvd = [verb_core_Vec.sub(uvs[1], uvs[0]), verb_core_Vec.sub(uvs[2], uvs[1]), verb_core_Vec.sub(uvs[0], uvs[2])];
            var s = [verb_core_Vec.sub(o[1], o[0]), verb_core_Vec.sub(o[2], o[1]), verb_core_Vec.sub(o[0], o[2])];
            var d = s.map(verb_core_Vec.normalized);
            var l = s.map(verb_core_Vec.norm);
            var minU = null;
            var maxU = null;
            var _g = 0;
            while (_g < 3) {
                var i = _g++;
                var o0 = o[i];
                var d0 = d[i];
                var res = verb_eval_Intersect.rays(o0, d0, ray.origin, ray.dir);
                if (res == null)
                    continue;
                var useg = res.u0;
                var uray = res.u1;
                if (useg < -verb_core_Constants.EPSILON || useg > l[i] + verb_core_Constants.EPSILON)
                    continue;
                if (minU == null || uray < minU.u)
                    minU = new verb_core_CurveTriPoint(uray, verb_core_Vec.onRay(ray.origin, ray.dir, uray), verb_core_Vec.onRay(uvs[i], uvd[i], useg / l[i]));
                if (maxU == null || uray > maxU.u)
                    maxU = new verb_core_CurveTriPoint(uray, verb_core_Vec.onRay(ray.origin, ray.dir, uray), verb_core_Vec.onRay(uvs[i], uvd[i], useg / l[i]));
            }
            if (maxU == null || minU == null)
                return null;
            return new verb_core_Interval(minU, maxU);
        };
        verb_eval_Intersect.mergeTriangleClipIntervals = function (clip1, clip2, mesh1, faceIndex1, mesh2, faceIndex2) {
            if (clip2.min.u > clip1.max.u + verb_core_Constants.EPSILON || clip1.min.u > clip2.max.u + verb_core_Constants.EPSILON)
                return null;
            var min;
            if (clip1.min.u > clip2.min.u)
                min = new verb_core_Pair(clip1.min, 0);
            else
                min = new verb_core_Pair(clip2.min, 1);
            var max;
            if (clip1.max.u < clip2.max.u)
                max = new verb_core_Pair(clip1.max, 0);
            else
                max = new verb_core_Pair(clip2.max, 1);
            var res = new verb_core_Interval(new verb_core_MeshIntersectionPoint(null, null, min.item0.point, faceIndex1, faceIndex2), new verb_core_MeshIntersectionPoint(null, null, max.item0.point, faceIndex1, faceIndex2));
            if (min.item1 == 0) {
                res.min.uv0 = min.item0.uv;
                res.min.uv1 = verb_core_Mesh.triangleUVFromPoint(mesh2, faceIndex2, min.item0.point);
            }
            else {
                res.min.uv0 = verb_core_Mesh.triangleUVFromPoint(mesh1, faceIndex1, min.item0.point);
                res.min.uv1 = min.item0.uv;
            }
            if (max.item1 == 0) {
                res.max.uv0 = max.item0.uv;
                res.max.uv1 = verb_core_Mesh.triangleUVFromPoint(mesh2, faceIndex2, max.item0.point);
            }
            else {
                res.max.uv0 = verb_core_Mesh.triangleUVFromPoint(mesh1, faceIndex1, max.item0.point);
                res.max.uv1 = max.item0.uv;
            }
            return res;
        };
        verb_eval_Intersect.planes = function (origin0, normal0, origin1, normal1) {
            var d = verb_core_Vec.cross(normal0, normal1);
            if (verb_core_Vec.dot(d, d) < verb_core_Constants.EPSILON)
                return null;
            var li = 0;
            var mi = Math.abs(d[0]);
            var m1 = Math.abs(d[1]);
            var m2 = Math.abs(d[2]);
            if (m1 > mi) {
                li = 1;
                mi = m1;
            }
            if (m2 > mi) {
                li = 2;
                mi = m2;
            }
            var a1;
            var b1;
            var a2;
            var b2;
            if (li == 0) {
                a1 = normal0[1];
                b1 = normal0[2];
                a2 = normal1[1];
                b2 = normal1[2];
            }
            else if (li == 1) {
                a1 = normal0[0];
                b1 = normal0[2];
                a2 = normal1[0];
                b2 = normal1[2];
            }
            else {
                a1 = normal0[0];
                b1 = normal0[1];
                a2 = normal1[0];
                b2 = normal1[1];
            }
            var d1 = -verb_core_Vec.dot(origin0, normal0);
            var d2 = -verb_core_Vec.dot(origin1, normal1);
            var den = a1 * b2 - b1 * a2;
            var x = (b1 * d2 - d1 * b2) / den;
            var y = (d1 * a2 - a1 * d2) / den;
            var p;
            if (li == 0)
                p = [0, x, y];
            else if (li == 1)
                p = [x, 0, y];
            else
                p = [x, y, 0];
            return new verb_core_Ray(p, verb_core_Vec.normalized(d));
        };
        verb_eval_Intersect.threePlanes = function (n0, d0, n1, d1, n2, d2) {
            var u = verb_core_Vec.cross(n1, n2);
            var den = verb_core_Vec.dot(n0, u);
            if (Math.abs(den) < verb_core_Constants.EPSILON)
                return null;
            var diff = verb_core_Vec.sub(verb_core_Vec.mul(d2, n1), verb_core_Vec.mul(d1, n2));
            var num = verb_core_Vec.add(verb_core_Vec.mul(d0, u), verb_core_Vec.cross(n0, diff));
            return verb_core_Vec.mul(1 / den, num);
        };
        verb_eval_Intersect.polylines = function (polyline0, polyline1, tol) {
            var res = verb_eval_Intersect.boundingBoxTrees(new verb_core_LazyPolylineBoundingBoxTree(polyline0), new verb_core_LazyPolylineBoundingBoxTree(polyline1), tol);
            var finalResults = [];
            var _g = 0;
            while (_g < res.length) {
                var event = res[_g];
                ++_g;
                var polid0 = event.item0;
                var polid1 = event.item1;
                var inter = verb_eval_Intersect.segments(polyline0.points[polid0], polyline0.points[polid0 + 1], polyline1.points[polid1], polyline1.points[polid1 + 1], tol);
                if (inter == null)
                    continue;
                inter.u0 = verb_core_Vec.lerp(inter.u0, [polyline0.params[polid0]], [polyline0.params[polid0 + 1]])[0];
                inter.u1 = verb_core_Vec.lerp(inter.u1, [polyline1.params[polid1]], [polyline1.params[polid1 + 1]])[0];
                finalResults.push(inter);
            }
            return finalResults;
        };
        verb_eval_Intersect.segments = function (a0, a1, b0, b1, tol) {
            var a1ma0 = verb_core_Vec.sub(a1, a0);
            var aN = Math.sqrt(verb_core_Vec.dot(a1ma0, a1ma0));
            var a = verb_core_Vec.mul(1 / aN, a1ma0);
            var b1mb0 = verb_core_Vec.sub(b1, b0);
            var bN = Math.sqrt(verb_core_Vec.dot(b1mb0, b1mb0));
            var b = verb_core_Vec.mul(1 / bN, b1mb0);
            var int_params = verb_eval_Intersect.rays(a0, a, b0, b);
            if (int_params != null) {
                var u0 = Math.min(Math.max(0, int_params.u0 / aN), 1.0);
                var u1 = Math.min(Math.max(0, int_params.u1 / bN), 1.0);
                var point0 = verb_core_Vec.onRay(a0, a1ma0, u0);
                var point1 = verb_core_Vec.onRay(b0, b1mb0, u1);
                var dist = verb_core_Vec.distSquared(point0, point1);
                if (dist < tol * tol)
                    return new verb_core_CurveCurveIntersection(point0, point1, u0, u1);
            }
            return null;
        };
        verb_eval_Intersect.rays = function (a0, a, b0, b) {
            var dab = verb_core_Vec.dot(a, b);
            var dab0 = verb_core_Vec.dot(a, b0);
            var daa0 = verb_core_Vec.dot(a, a0);
            var dbb0 = verb_core_Vec.dot(b, b0);
            var dba0 = verb_core_Vec.dot(b, a0);
            var daa = verb_core_Vec.dot(a, a);
            var dbb = verb_core_Vec.dot(b, b);
            var div = daa * dbb - dab * dab;
            if (Math.abs(div) < verb_core_Constants.EPSILON)
                return null;
            var num = dab * (dab0 - daa0) - daa * (dbb0 - dba0);
            var w = num / div;
            var t = (dab0 - daa0 + w * dab) / daa;
            var p0 = verb_core_Vec.onRay(a0, a, t);
            var p1 = verb_core_Vec.onRay(b0, b, w);
            return new verb_core_CurveCurveIntersection(p0, p1, t, w);
        };
        verb_eval_Intersect.segmentWithTriangle = function (p0, p1, points, tri) {
            var v0 = points[tri[0]];
            var v1 = points[tri[1]];
            var v2 = points[tri[2]];
            var u = verb_core_Vec.sub(v1, v0);
            var v = verb_core_Vec.sub(v2, v0);
            var n = verb_core_Vec.cross(u, v);
            var dir = verb_core_Vec.sub(p1, p0);
            var w0 = verb_core_Vec.sub(p0, v0);
            var a = -verb_core_Vec.dot(n, w0);
            var b = verb_core_Vec.dot(n, dir);
            if (Math.abs(b) < verb_core_Constants.EPSILON)
                return null;
            var r = a / b;
            if (r < 0 || r > 1)
                return null;
            var pt = verb_core_Vec.add(p0, verb_core_Vec.mul(r, dir));
            var uv = verb_core_Vec.dot(u, v);
            var uu = verb_core_Vec.dot(u, u);
            var vv = verb_core_Vec.dot(v, v);
            var w = verb_core_Vec.sub(pt, v0);
            var wu = verb_core_Vec.dot(w, u);
            var wv = verb_core_Vec.dot(w, v);
            var denom = uv * uv - uu * vv;
            if (Math.abs(denom) < verb_core_Constants.EPSILON)
                return null;
            var s = (uv * wv - vv * wu) / denom;
            var t = (uv * wu - uu * wv) / denom;
            if (s > 1.0 + verb_core_Constants.EPSILON || t > 1.0 + verb_core_Constants.EPSILON || t < -verb_core_Constants.EPSILON || s < -verb_core_Constants.EPSILON || s + t > 1.0 + verb_core_Constants.EPSILON)
                return null;
            return new verb_core_TriSegmentIntersection(pt, s, t, r);
        };
        verb_eval_Intersect.segmentAndPlane = function (p0, p1, v0, n) {
            var denom = verb_core_Vec.dot(n, verb_core_Vec.sub(p1, p0));
            if (Math.abs(denom) < verb_core_Constants.EPSILON)
                return null;
            var numer = verb_core_Vec.dot(n, verb_core_Vec.sub(v0, p0));
            var p = numer / denom;
            if (p > 1.0 + verb_core_Constants.EPSILON || p < -verb_core_Constants.EPSILON)
                return null;
            return { p: p };
        };
        var verb_eval_Make = $hx_exports.eval.Make = function () { };
        $hxClasses["verb.eval.Make"] = verb_eval_Make;
        verb_eval_Make.__name__ = ["verb", "eval", "Make"];
        verb_eval_Make.rationalTranslationalSurface = function (profile, rail) {
            var pt0 = verb_eval_Eval.rationalCurvePoint(rail, verb_core_ArrayExtensions.first(rail.knots));
            var startu = verb_core_ArrayExtensions.first(rail.knots);
            var endu = verb_core_ArrayExtensions.last(rail.knots);
            var numSamples = 2 * rail.controlPoints.length;
            var span = (endu - startu) / (numSamples - 1);
            var crvs = [];
            var _g = 0;
            while (_g < numSamples) {
                var i = _g++;
                var pt = verb_core_Vec.sub(verb_eval_Eval.rationalCurvePoint(rail, startu + i * span), pt0);
                var crv = verb_eval_Modify.rationalCurveTransform(profile, [[1, 0, 0, pt[0]], [0, 1, 0, pt[1]], [0, 0, 1, pt[2]], [0, 0, 0, 1]]);
                crvs.push(crv);
            }
            return verb_eval_Make.loftedSurface(crvs);
        };
        verb_eval_Make.surfaceBoundaryCurves = function (surface) {
            var crvs = [];
            var c0 = verb_eval_Make.surfaceIsocurve(surface, verb_core_ArrayExtensions.first(surface.knotsU), false);
            var c1 = verb_eval_Make.surfaceIsocurve(surface, verb_core_ArrayExtensions.last(surface.knotsU), false);
            var c2 = verb_eval_Make.surfaceIsocurve(surface, verb_core_ArrayExtensions.first(surface.knotsV), true);
            var c3 = verb_eval_Make.surfaceIsocurve(surface, verb_core_ArrayExtensions.last(surface.knotsV), true);
            return [c0, c1, c2, c3];
        };
        verb_eval_Make.surfaceIsocurve = function (surface, u, useV) {
            if (useV == null)
                useV = false;
            var knots;
            if (useV)
                knots = surface.knotsV;
            else
                knots = surface.knotsU;
            var degree;
            if (useV)
                degree = surface.degreeV;
            else
                degree = surface.degreeU;
            var knotMults = verb_eval_Analyze.knotMultiplicities(knots);
            var reqKnotIndex = -1;
            var _g1 = 0;
            var _g = knotMults.length;
            while (_g1 < _g) {
                var i = _g1++;
                if (Math.abs(u - knotMults[i].knot) < verb_core_Constants.EPSILON) {
                    reqKnotIndex = i;
                    break;
                }
            }
            var numKnotsToInsert = degree + 1;
            if (reqKnotIndex >= 0)
                numKnotsToInsert = numKnotsToInsert - knotMults[reqKnotIndex].mult;
            var newSrf;
            if (numKnotsToInsert > 0)
                newSrf = verb_eval_Modify.surfaceKnotRefine(surface, verb_core_Vec.rep(numKnotsToInsert, u), useV);
            else
                newSrf = surface;
            var span = verb_eval_Eval.knotSpan(degree, u, knots);
            if (Math.abs(u - verb_core_ArrayExtensions.first(knots)) < verb_core_Constants.EPSILON)
                span = 0;
            else if (Math.abs(u - verb_core_ArrayExtensions.last(knots)) < verb_core_Constants.EPSILON)
                span = (useV ? newSrf.controlPoints[0].length : newSrf.controlPoints.length) - 1;
            if (useV)
                return new verb_core_NurbsCurveData(newSrf.degreeU, newSrf.knotsU, (function ($this) {
                    var $r;
                    var _g2 = [];
                    {
                        var _g11 = 0;
                        var _g21 = newSrf.controlPoints;
                        while (_g11 < _g21.length) {
                            var row = _g21[_g11];
                            ++_g11;
                            _g2.push(row[span]);
                        }
                    }
                    $r = _g2;
                    return $r;
                }(this)));
            return new verb_core_NurbsCurveData(newSrf.degreeV, newSrf.knotsV, newSrf.controlPoints[span]);
        };
        verb_eval_Make.loftedSurface = function (curves, degreeV) {
            curves = verb_eval_Modify.unifyCurveKnotVectors(curves);
            var degreeU = curves[0].degree;
            if (degreeV == null)
                degreeV = 3;
            if (degreeV > curves.length - 1)
                degreeV = curves.length - 1;
            var knotsU = curves[0].knots;
            var knotsV = [];
            var controlPoints = [];
            var _g1 = 0;
            var _g = curves[0].controlPoints.length;
            while (_g1 < _g) {
                var i = [_g1++];
                var points = curves.map((function (i) {
                    return function (x) {
                        return x.controlPoints[i[0]];
                    };
                })(i));
                var c = verb_eval_Make.rationalInterpCurve(points, degreeV, true);
                controlPoints.push(c.controlPoints);
                knotsV = c.knots;
            }
            return new verb_core_NurbsSurfaceData(degreeU, degreeV, knotsU, knotsV, controlPoints);
        };
        verb_eval_Make.clonedCurve = function (curve) {
            return new verb_core_NurbsCurveData(curve.degree, curve.knots.slice(), curve.controlPoints.map(function (x) {
                return x.slice();
            }));
        };
        verb_eval_Make.rationalBezierCurve = function (controlPoints, weights) {
            var degree = controlPoints.length - 1;
            var knots = [];
            var _g1 = 0;
            var _g = degree + 1;
            while (_g1 < _g) {
                var i = _g1++;
                knots.push(0.0);
            }
            var _g11 = 0;
            var _g2 = degree + 1;
            while (_g11 < _g2) {
                var i1 = _g11++;
                knots.push(1.0);
            }
            if (weights == null)
                weights = verb_core_Vec.rep(controlPoints.length, 1.0);
            return new verb_core_NurbsCurveData(degree, knots, verb_eval_Eval.homogenize1d(controlPoints, weights));
        };
        verb_eval_Make.fourPointSurface = function (p1, p2, p3, p4, degree) {
            if (degree == null)
                degree = 3;
            var degreeFloat = degree;
            var pts = [];
            var _g1 = 0;
            var _g = degree + 1;
            while (_g1 < _g) {
                var i = _g1++;
                var row = [];
                var _g3 = 0;
                var _g2 = degree + 1;
                while (_g3 < _g2) {
                    var j = _g3++;
                    var l = 1.0 - i / degreeFloat;
                    var p1p2 = verb_core_Vec.lerp(l, p1, p2);
                    var p4p3 = verb_core_Vec.lerp(l, p4, p3);
                    var res = verb_core_Vec.lerp(1.0 - j / degreeFloat, p1p2, p4p3);
                    res.push(1.0);
                    row.push(res);
                }
                pts.push(row);
            }
            var zeros = verb_core_Vec.rep(degree + 1, 0.0);
            var ones = verb_core_Vec.rep(degree + 1, 1.0);
            return new verb_core_NurbsSurfaceData(degree, degree, zeros.concat(ones), zeros.concat(ones), pts);
        };
        verb_eval_Make.ellipseArc = function (center, xaxis, yaxis, startAngle, endAngle) {
            var xradius = verb_core_Vec.norm(xaxis);
            var yradius = verb_core_Vec.norm(yaxis);
            xaxis = verb_core_Vec.normalized(xaxis);
            yaxis = verb_core_Vec.normalized(yaxis);
            if (endAngle < startAngle)
                endAngle = 2.0 * Math.PI + startAngle;
            var theta = endAngle - startAngle;
            var numArcs = 0;
            if (theta <= Math.PI / 2)
                numArcs = 1;
            else if (theta <= Math.PI)
                numArcs = 2;
            else if (theta <= 3 * Math.PI / 2)
                numArcs = 3;
            else
                numArcs = 4;
            var dtheta = theta / numArcs;
            var n = 2 * numArcs;
            var w1 = Math.cos(dtheta / 2);
            var P0 = verb_core_Vec.add(center, verb_core_Vec.add(verb_core_Vec.mul(xradius * Math.cos(startAngle), xaxis), verb_core_Vec.mul(yradius * Math.sin(startAngle), yaxis)));
            var T0 = verb_core_Vec.sub(verb_core_Vec.mul(Math.cos(startAngle), yaxis), verb_core_Vec.mul(Math.sin(startAngle), xaxis));
            var controlPoints = [];
            var knots = verb_core_Vec.zeros1d(2 * numArcs + 3);
            var index = 0;
            var angle = startAngle;
            var weights = verb_core_Vec.zeros1d(numArcs * 2);
            controlPoints[0] = P0;
            weights[0] = 1.0;
            var _g1 = 1;
            var _g = numArcs + 1;
            while (_g1 < _g) {
                var i = _g1++;
                angle += dtheta;
                var P2 = verb_core_Vec.add(center, verb_core_Vec.add(verb_core_Vec.mul(xradius * Math.cos(angle), xaxis), verb_core_Vec.mul(yradius * Math.sin(angle), yaxis)));
                weights[index + 2] = 1;
                controlPoints[index + 2] = P2;
                var T2 = verb_core_Vec.sub(verb_core_Vec.mul(Math.cos(angle), yaxis), verb_core_Vec.mul(Math.sin(angle), xaxis));
                var inters = verb_eval_Intersect.rays(P0, verb_core_Vec.mul(1 / verb_core_Vec.norm(T0), T0), P2, verb_core_Vec.mul(1 / verb_core_Vec.norm(T2), T2));
                var P1 = verb_core_Vec.add(P0, verb_core_Vec.mul(inters.u0, T0));
                weights[index + 1] = w1;
                controlPoints[index + 1] = P1;
                index += 2;
                if (i < numArcs) {
                    P0 = P2;
                    T0 = T2;
                }
            }
            var j = 2 * numArcs + 1;
            var _g2 = 0;
            while (_g2 < 3) {
                var i1 = _g2++;
                knots[i1] = 0.0;
                knots[i1 + j] = 1.0;
            }
            switch (numArcs) {
                case 2:
                    knots[3] = knots[4] = 0.5;
                    break;
                case 3:
                    knots[3] = knots[4] = 0.333333333333333315;
                    knots[5] = knots[6] = 0.66666666666666663;
                    break;
                case 4:
                    knots[3] = knots[4] = 0.25;
                    knots[5] = knots[6] = 0.5;
                    knots[7] = knots[8] = 0.75;
                    break;
            }
            return new verb_core_NurbsCurveData(2, knots, verb_eval_Eval.homogenize1d(controlPoints, weights));
        };
        verb_eval_Make.arc = function (center, xaxis, yaxis, radius, startAngle, endAngle) {
            return verb_eval_Make.ellipseArc(center, verb_core_Vec.mul(radius, verb_core_Vec.normalized(xaxis)), verb_core_Vec.mul(radius, verb_core_Vec.normalized(yaxis)), startAngle, endAngle);
        };
        verb_eval_Make.polyline = function (pts) {
            var knots = [0.0, 0.0];
            var lsum = 0.0;
            var _g1 = 0;
            var _g = pts.length - 1;
            while (_g1 < _g) {
                var i = _g1++;
                lsum += verb_core_Vec.dist(pts[i], pts[i + 1]);
                knots.push(lsum);
            }
            knots.push(lsum);
            knots = verb_core_Vec.mul(1 / lsum, knots);
            var weights;
            var _g2 = [];
            var _g21 = 0;
            var _g11 = pts.length;
            while (_g21 < _g11) {
                var i1 = _g21++;
                _g2.push(1.0);
            }
            weights = _g2;
            return new verb_core_NurbsCurveData(1, knots, verb_eval_Eval.homogenize1d(pts.slice(0), weights));
        };
        verb_eval_Make.extrudedSurface = function (axis, length, profile) {
            var controlPoints = [[], [], []];
            var weights = [[], [], []];
            var prof_controlPoints = verb_eval_Eval.dehomogenize1d(profile.controlPoints);
            var prof_weights = verb_eval_Eval.weight1d(profile.controlPoints);
            var translation = verb_core_Vec.mul(length, axis);
            var halfTranslation = verb_core_Vec.mul(0.5 * length, axis);
            var _g1 = 0;
            var _g = prof_controlPoints.length;
            while (_g1 < _g) {
                var j = _g1++;
                controlPoints[2][j] = prof_controlPoints[j];
                controlPoints[1][j] = verb_core_Vec.add(halfTranslation, prof_controlPoints[j]);
                controlPoints[0][j] = verb_core_Vec.add(translation, prof_controlPoints[j]);
                weights[0][j] = prof_weights[j];
                weights[1][j] = prof_weights[j];
                weights[2][j] = prof_weights[j];
            }
            return new verb_core_NurbsSurfaceData(2, profile.degree, [0, 0, 0, 1, 1, 1], profile.knots, verb_eval_Eval.homogenize2d(controlPoints, weights));
        };
        verb_eval_Make.cylindricalSurface = function (axis, xaxis, base, height, radius) {
            var yaxis = verb_core_Vec.cross(axis, xaxis);
            var angle = 2.0 * Math.PI;
            var circ = verb_eval_Make.arc(base, xaxis, yaxis, radius, 0.0, 2 * Math.PI);
            return verb_eval_Make.extrudedSurface(axis, height, circ);
        };
        verb_eval_Make.revolvedSurface = function (profile, center, axis, theta) {
            var prof_controlPoints = verb_eval_Eval.dehomogenize1d(profile.controlPoints);
            var prof_weights = verb_eval_Eval.weight1d(profile.controlPoints);
            var narcs;
            var knotsU;
            var controlPoints;
            var weights;
            if (theta <= Math.PI / 2) {
                narcs = 1;
                knotsU = verb_core_Vec.zeros1d(6 + 2 * (narcs - 1));
            }
            else if (theta <= Math.PI) {
                narcs = 2;
                knotsU = verb_core_Vec.zeros1d(6 + 2 * (narcs - 1));
                knotsU[3] = knotsU[4] = 0.5;
            }
            else if (theta <= 3 * Math.PI / 2) {
                narcs = 3;
                knotsU = verb_core_Vec.zeros1d(6 + 2 * (narcs - 1));
                knotsU[3] = knotsU[4] = 0.333333333333333315;
                knotsU[5] = knotsU[6] = 0.66666666666666663;
            }
            else {
                narcs = 4;
                knotsU = verb_core_Vec.zeros1d(6 + 2 * (narcs - 1));
                knotsU[3] = knotsU[4] = 0.25;
                knotsU[5] = knotsU[6] = 0.5;
                knotsU[7] = knotsU[8] = 0.75;
            }
            var dtheta = theta / narcs;
            var j = 3 + 2 * (narcs - 1);
            var _g = 0;
            while (_g < 3) {
                var i = _g++;
                knotsU[i] = 0.0;
                knotsU[j + i] = 1.0;
            }
            var n = 2 * narcs;
            var wm = Math.cos(dtheta / 2.0);
            var angle = 0.0;
            var sines = verb_core_Vec.zeros1d(narcs + 1);
            var cosines = verb_core_Vec.zeros1d(narcs + 1);
            var controlPoints1 = verb_core_Vec.zeros3d(2 * narcs + 1, prof_controlPoints.length, 3);
            var weights1 = verb_core_Vec.zeros2d(2 * narcs + 1, prof_controlPoints.length);
            var _g1 = 1;
            var _g2 = narcs + 1;
            while (_g1 < _g2) {
                var i1 = _g1++;
                angle += dtheta;
                cosines[i1] = Math.cos(angle);
                sines[i1] = Math.sin(angle);
            }
            var _g11 = 0;
            var _g3 = prof_controlPoints.length;
            while (_g11 < _g3) {
                var j1 = _g11++;
                var O = verb_core_Trig.rayClosestPoint(prof_controlPoints[j1], center, axis);
                var X = verb_core_Vec.sub(prof_controlPoints[j1], O);
                var r = verb_core_Vec.norm(X);
                var Y = verb_core_Vec.cross(axis, X);
                if (r > verb_core_Constants.EPSILON) {
                    X = verb_core_Vec.mul(1 / r, X);
                    Y = verb_core_Vec.mul(1 / r, Y);
                }
                controlPoints1[0][j1] = prof_controlPoints[j1];
                var P0 = prof_controlPoints[j1];
                weights1[0][j1] = prof_weights[j1];
                var T0 = Y;
                var index = 0;
                var angle1 = 0.0;
                var _g31 = 1;
                var _g21 = narcs + 1;
                while (_g31 < _g21) {
                    var i2 = _g31++;
                    var P2;
                    if (r == 0)
                        P2 = O;
                    else
                        P2 = verb_core_Vec.add(O, verb_core_Vec.add(verb_core_Vec.mul(r * cosines[i2], X), verb_core_Vec.mul(r * sines[i2], Y)));
                    controlPoints1[index + 2][j1] = P2;
                    weights1[index + 2][j1] = prof_weights[j1];
                    var T2 = verb_core_Vec.sub(verb_core_Vec.mul(cosines[i2], Y), verb_core_Vec.mul(sines[i2], X));
                    if (r == 0)
                        controlPoints1[index + 1][j1] = O;
                    else {
                        var inters = verb_eval_Intersect.rays(P0, verb_core_Vec.mul(1 / verb_core_Vec.norm(T0), T0), P2, verb_core_Vec.mul(1 / verb_core_Vec.norm(T2), T2));
                        var P1 = verb_core_Vec.add(P0, verb_core_Vec.mul(inters.u0, T0));
                        controlPoints1[index + 1][j1] = P1;
                    }
                    weights1[index + 1][j1] = wm * prof_weights[j1];
                    index += 2;
                    if (i2 < narcs) {
                        P0 = P2;
                        T0 = T2;
                    }
                }
            }
            return new verb_core_NurbsSurfaceData(2, profile.degree, knotsU, profile.knots, verb_eval_Eval.homogenize2d(controlPoints1, weights1));
        };
        verb_eval_Make.sphericalSurface = function (center, axis, xaxis, radius) {
            var arc = verb_eval_Make.arc(center, verb_core_Vec.mul(-1.0, axis), xaxis, radius, 0.0, Math.PI);
            return verb_eval_Make.revolvedSurface(arc, center, axis, 2 * Math.PI);
        };
        verb_eval_Make.conicalSurface = function (axis, xaxis, base, height, radius) {
            var angle = 2 * Math.PI;
            var prof_degree = 1;
            var prof_ctrl_pts = [verb_core_Vec.add(base, verb_core_Vec.mul(height, axis)), verb_core_Vec.add(base, verb_core_Vec.mul(radius, xaxis))];
            var prof_knots = [0.0, 0.0, 1.0, 1.0];
            var prof_weights = [1.0, 1.0];
            var prof = new verb_core_NurbsCurveData(prof_degree, prof_knots, verb_eval_Eval.homogenize1d(prof_ctrl_pts, prof_weights));
            return verb_eval_Make.revolvedSurface(prof, base, axis, angle);
        };
        verb_eval_Make.rationalInterpCurve = function (points, degree, homogeneousPoints, start_tangent, end_tangent) {
            if (homogeneousPoints == null)
                homogeneousPoints = false;
            if (degree == null)
                degree = 3;
            if (points.length < degree + 1)
                throw new js__$Boot_HaxeError("You need to supply at least degree + 1 points! You only supplied " + points.length + " points.");
            var us = [0.0];
            var _g1 = 1;
            var _g = points.length;
            while (_g1 < _g) {
                var i = _g1++;
                var chord = verb_core_Vec.norm(verb_core_Vec.sub(points[i], points[i - 1]));
                var last = us[us.length - 1];
                us.push(last + chord);
            }
            var max = us[us.length - 1];
            var _g11 = 0;
            var _g2 = us.length;
            while (_g11 < _g2) {
                var i1 = _g11++;
                us[i1] = us[i1] / max;
            }
            var knotsStart = verb_core_Vec.rep(degree + 1, 0.0);
            var hasTangents = start_tangent != null && end_tangent != null;
            var start;
            if (hasTangents)
                start = 0;
            else
                start = 1;
            var end;
            if (hasTangents)
                end = us.length - degree + 1;
            else
                end = us.length - degree;
            var _g3 = start;
            while (_g3 < end) {
                var i2 = _g3++;
                var weightSums = 0.0;
                var _g12 = 0;
                while (_g12 < degree) {
                    var j = _g12++;
                    weightSums += us[i2 + j];
                }
                knotsStart.push(1 / degree * weightSums);
            }
            var knots = knotsStart.concat(verb_core_Vec.rep(degree + 1, 1.0));
            var A = [];
            var n;
            if (hasTangents)
                n = points.length + 1;
            else
                n = points.length - 1;
            var lst;
            if (hasTangents)
                lst = 1;
            else
                lst = 0;
            var ld;
            if (hasTangents)
                ld = points.length - (degree - 1);
            else
                ld = points.length - (degree + 1);
            var _g4 = 0;
            while (_g4 < us.length) {
                var u = us[_g4];
                ++_g4;
                var span = verb_eval_Eval.knotSpanGivenN(n, degree, u, knots);
                var basisFuncs = verb_eval_Eval.basisFunctionsGivenKnotSpanIndex(span, u, degree, knots);
                var ls = span - degree;
                var rowstart = verb_core_Vec.zeros1d(ls);
                var rowend = verb_core_Vec.zeros1d(ld - ls);
                A.push(rowstart.concat(basisFuncs).concat(rowend));
            }
            if (hasTangents) {
                var ln = A[0].length - 2;
                var tanRow0 = [-1.0, 1.0].concat(verb_core_Vec.zeros1d(ln));
                var tanRow1 = verb_core_Vec.zeros1d(ln).concat([-1.0, 1.0]);
                verb_core_ArrayExtensions.spliceAndInsert(A, 1, 0, tanRow0);
                verb_core_ArrayExtensions.spliceAndInsert(A, A.length - 1, 0, tanRow1);
            }
            var dim = points[0].length;
            var xs = [];
            var mult1 = (1 - knots[knots.length - degree - 2]) / degree;
            var mult0 = knots[degree + 1] / degree;
            var _g5 = 0;
            while (_g5 < dim) {
                var i3 = [_g5++];
                var b;
                if (!hasTangents)
                    b = points.map((function (i3) {
                        return function (x1) {
                            return x1[i3[0]];
                        };
                    })(i3));
                else {
                    b = [points[0][i3[0]]];
                    b.push(mult0 * start_tangent[i3[0]]);
                    var _g21 = 1;
                    var _g13 = points.length - 1;
                    while (_g21 < _g13) {
                        var j1 = _g21++;
                        b.push(points[j1][i3[0]]);
                    }
                    b.push(mult1 * end_tangent[i3[0]]);
                    b.push(verb_core_ArrayExtensions.last(points)[i3[0]]);
                }
                var x = verb_core_Mat.solve(A, b);
                xs.push(x);
            }
            var controlPts = verb_core_Mat.transpose(xs);
            if (!homogeneousPoints) {
                var weights = verb_core_Vec.rep(controlPts.length, 1.0);
                controlPts = verb_eval_Eval.homogenize1d(controlPts, weights);
            }
            return new verb_core_NurbsCurveData(degree, knots, controlPts);
        };
        var verb_eval_Modify = $hx_exports.eval.Modify = function () { };
        $hxClasses["verb.eval.Modify"] = verb_eval_Modify;
        verb_eval_Modify.__name__ = ["verb", "eval", "Modify"];
        verb_eval_Modify.curveReverse = function (curve) {
            return new verb_core_NurbsCurveData(curve.degree, verb_eval_Modify.knotsReverse(curve.knots), verb_core_ArrayExtensions.reversed(curve.controlPoints));
        };
        verb_eval_Modify.surfaceReverse = function (surface, useV) {
            if (useV == null)
                useV = false;
            if (useV)
                return new verb_core_NurbsSurfaceData(surface.degreeU, surface.degreeV, surface.knotsU, verb_eval_Modify.knotsReverse(surface.knotsV), (function ($this) {
                    var $r;
                    var _g = [];
                    {
                        var _g1 = 0;
                        var _g2 = surface.controlPoints;
                        while (_g1 < _g2.length) {
                            var row = _g2[_g1];
                            ++_g1;
                            _g.push(verb_core_ArrayExtensions.reversed(row));
                        }
                    }
                    $r = _g;
                    return $r;
                }(this)));
            return new verb_core_NurbsSurfaceData(surface.degreeU, surface.degreeV, verb_eval_Modify.knotsReverse(surface.knotsU), surface.knotsV, verb_core_ArrayExtensions.reversed(surface.controlPoints));
        };
        verb_eval_Modify.knotsReverse = function (knots) {
            var min = verb_core_ArrayExtensions.first(knots);
            var max = verb_core_ArrayExtensions.last(knots);
            var l = [min];
            var len = knots.length;
            var _g = 1;
            while (_g < len) {
                var i = _g++;
                l.push(l[i - 1] + (knots[len - i] - knots[len - i - 1]));
            }
            return l;
        };
        verb_eval_Modify.unifyCurveKnotVectors = function (curves) {
            curves = curves.map(verb_eval_Make.clonedCurve);
            var maxDegree = Lambda.fold(curves, function (x, a) {
                return verb_eval_Modify.imax(x.degree, a);
            }, 0);
            var _g1 = 0;
            var _g = curves.length;
            while (_g1 < _g) {
                var i = _g1++;
                if (curves[i].degree < maxDegree)
                    curves[i] = verb_eval_Modify.curveElevateDegree(curves[i], maxDegree);
            }
            var knotIntervals;
            var _g2 = [];
            var _g11 = 0;
            while (_g11 < curves.length) {
                var c = curves[_g11];
                ++_g11;
                _g2.push(new verb_core_Interval(verb_core_ArrayExtensions.first(c.knots), verb_core_ArrayExtensions.last(c.knots)));
            }
            knotIntervals = _g2;
            var _g21 = 0;
            var _g12 = curves.length;
            while (_g21 < _g12) {
                var i1 = _g21++;
                var min = [knotIntervals[i1].min];
                curves[i1].knots = curves[i1].knots.map((function (min) {
                    return function (x4) {
                        return x4 - min[0];
                    };
                })(min));
            }
            var knotSpans = knotIntervals.map(function (x1) {
                return x1.max - x1.min;
            });
            var maxKnotSpan = Lambda.fold(knotSpans, function (x2, a1) {
                return Math.max(x2, a1);
            }, 0.0);
            var _g22 = 0;
            var _g13 = curves.length;
            while (_g22 < _g13) {
                var i2 = _g22++;
                var scale = [maxKnotSpan / knotSpans[i2]];
                curves[i2].knots = curves[i2].knots.map((function (scale) {
                    return function (x5) {
                        return x5 * scale[0];
                    };
                })(scale));
            }
            var mergedKnots = Lambda.fold(curves, function (x3, a2) {
                return verb_core_Vec.sortedSetUnion(x3.knots, a2);
            }, []);
            var _g23 = 0;
            var _g14 = curves.length;
            while (_g23 < _g14) {
                var i3 = _g23++;
                var rem = verb_core_Vec.sortedSetSub(mergedKnots, curves[i3].knots);
                if (rem.length == 0)
                    curves[i3] = curves[i3];
                curves[i3] = verb_eval_Modify.curveKnotRefine(curves[i3], rem);
            }
            return curves;
        };
        verb_eval_Modify.imin = function (a, b) {
            if (a < b)
                return a;
            else
                return b;
        };
        verb_eval_Modify.imax = function (a, b) {
            if (a > b)
                return a;
            else
                return b;
        };
        verb_eval_Modify.curveElevateDegree = function (curve, finalDegree) {
            if (finalDegree <= curve.degree)
                return curve;
            var n = curve.knots.length - curve.degree - 2;
            var newDegree = curve.degree;
            var knots = curve.knots;
            var controlPoints = curve.controlPoints;
            var degreeInc = finalDegree - curve.degree;
            var dim = curve.controlPoints[0].length;
            var bezalfs = verb_core_Vec.zeros2d(newDegree + degreeInc + 1, newDegree + 1);
            var bpts = [];
            var ebpts = [];
            var Nextbpts = [];
            var alphas = [];
            var m = n + newDegree + 1;
            var ph = finalDegree;
            var ph2 = Math.floor(ph / 2);
            var Qw = [];
            var Uh = [];
            var nh;
            bezalfs[0][0] = 1.0;
            bezalfs[ph][newDegree] = 1.0;
            var _g1 = 1;
            var _g = ph2 + 1;
            while (_g1 < _g) {
                var i = _g1++;
                var inv = 1.0 / verb_core_Binomial.get(ph, i);
                var mpi = verb_eval_Modify.imin(newDegree, i);
                var _g3 = verb_eval_Modify.imax(0, i - degreeInc);
                var _g2 = mpi + 1;
                while (_g3 < _g2) {
                    var j = _g3++;
                    bezalfs[i][j] = inv * verb_core_Binomial.get(newDegree, j) * verb_core_Binomial.get(degreeInc, i - j);
                }
            }
            var _g4 = ph2 + 1;
            while (_g4 < ph) {
                var i1 = _g4++;
                var mpi1 = verb_eval_Modify.imin(newDegree, i1);
                var _g21 = verb_eval_Modify.imax(0, i1 - degreeInc);
                var _g11 = mpi1 + 1;
                while (_g21 < _g11) {
                    var j1 = _g21++;
                    bezalfs[i1][j1] = bezalfs[ph - i1][newDegree - j1];
                }
            }
            var mh = ph;
            var kind = ph + 1;
            var r = -1;
            var a = newDegree;
            var b = newDegree + 1;
            var cind = 1;
            var ua = knots[0];
            Qw[0] = controlPoints[0];
            var _g12 = 0;
            var _g5 = ph + 1;
            while (_g12 < _g5) {
                var i2 = _g12++;
                Uh[i2] = ua;
            }
            var _g13 = 0;
            var _g6 = newDegree + 1;
            while (_g13 < _g6) {
                var i3 = _g13++;
                bpts[i3] = controlPoints[i3];
            }
            while (b < m) {
                var i4 = b;
                while (b < m && knots[b] == knots[b + 1])
                    b = b + 1;
                var mul = b - i4 + 1;
                var mh1 = mh + mul + degreeInc;
                var ub = knots[b];
                var oldr = r;
                r = newDegree - mul;
                var lbz;
                if (oldr > 0)
                    lbz = Math.floor((oldr + 2) / 2);
                else
                    lbz = 1;
                var rbz;
                if (r > 0)
                    rbz = Math.floor(ph - (r + 1) / 2);
                else
                    rbz = ph;
                if (r > 0) {
                    var numer = ub - ua;
                    var alfs = [];
                    var k = newDegree;
                    while (k > mul) {
                        alfs[k - mul - 1] = numer / (knots[a + k] - ua);
                        k--;
                    }
                    var _g14 = 1;
                    var _g7 = r + 1;
                    while (_g14 < _g7) {
                        var j2 = _g14++;
                        var save = r - j2;
                        var s = mul + j2;
                        var k1 = newDegree;
                        while (k1 >= s) {
                            bpts[k1] = verb_core_Vec.add(verb_core_Vec.mul(alfs[k1 - s], bpts[k1]), verb_core_Vec.mul(1.0 - alfs[k1 - s], bpts[k1 - 1]));
                            k1--;
                        }
                        Nextbpts[save] = bpts[newDegree];
                    }
                }
                var _g15 = lbz;
                var _g8 = ph + 1;
                while (_g15 < _g8) {
                    var i5 = _g15++;
                    ebpts[i5] = verb_core_Vec.zeros1d(dim);
                    var mpi2 = verb_eval_Modify.imin(newDegree, i5);
                    var _g31 = verb_eval_Modify.imax(0, i5 - degreeInc);
                    var _g22 = mpi2 + 1;
                    while (_g31 < _g22) {
                        var j3 = _g31++;
                        ebpts[i5] = verb_core_Vec.add(ebpts[i5], verb_core_Vec.mul(bezalfs[i5][j3], bpts[j3]));
                    }
                }
                if (oldr > 1) {
                    var first = kind - 2;
                    var last = kind;
                    var den = ub - ua;
                    var bet = (ub - Uh[kind - 1]) / den;
                    var _g9 = 1;
                    while (_g9 < oldr) {
                        var tr = _g9++;
                        var i6 = first;
                        var j4 = last;
                        var kj = j4 - kind + 1;
                        while (j4 - i6 > tr) {
                            if (i6 < cind) {
                                var alf = (ub - Uh[i6]) / (ua - Uh[i6]);
                                Qw[i6] = verb_core_Vec.lerp(alf, Qw[i6], Qw[i6 - 1]);
                            }
                            if (j4 >= lbz) {
                                if (j4 - tr <= kind - ph + oldr) {
                                    var gam = (ub - Uh[j4 - tr]) / den;
                                    ebpts[kj] = verb_core_Vec.lerp(gam, ebpts[kj], ebpts[kj + 1]);
                                }
                            }
                            else
                                ebpts[kj] = verb_core_Vec.lerp(bet, ebpts[kj], ebpts[kj + 1]);
                            i6 = i6 + 1;
                            j4 = j4 - 1;
                            kj = kj - 1;
                        }
                        first = first - 1;
                        last = last + 1;
                    }
                }
                if (a != newDegree) {
                    var _g16 = 0;
                    var _g10 = ph - oldr;
                    while (_g16 < _g10) {
                        var i7 = _g16++;
                        Uh[kind] = ua;
                        kind = kind + 1;
                    }
                }
                var _g17 = lbz;
                var _g18 = rbz + 1;
                while (_g17 < _g18) {
                    var j5 = _g17++;
                    Qw[cind] = ebpts[j5];
                    cind = cind + 1;
                }
                if (b < m) {
                    var _g19 = 0;
                    while (_g19 < r) {
                        var j6 = _g19++;
                        bpts[j6] = Nextbpts[j6];
                    }
                    var _g110 = r;
                    var _g20 = newDegree + 1;
                    while (_g110 < _g20) {
                        var j7 = _g110++;
                        bpts[j7] = controlPoints[b - newDegree + j7];
                    }
                    a = b;
                    b = b + 1;
                    ua = ub;
                }
                else {
                    var _g111 = 0;
                    var _g23 = ph + 1;
                    while (_g111 < _g23) {
                        var i8 = _g111++;
                        Uh[kind + i8] = ub;
                    }
                }
            }
            nh = mh - ph - 1;
            return new verb_core_NurbsCurveData(finalDegree, Uh, Qw);
        };
        verb_eval_Modify.rationalSurfaceTransform = function (surface, mat) {
            var pts = verb_eval_Eval.dehomogenize2d(surface.controlPoints);
            var _g1 = 0;
            var _g = pts.length;
            while (_g1 < _g) {
                var i = _g1++;
                var _g3 = 0;
                var _g2 = pts[i].length;
                while (_g3 < _g2) {
                    var j = _g3++;
                    var homoPt = pts[i][j];
                    homoPt.push(1.0);
                    pts[i][j] = verb_core_Mat.dot(mat, homoPt).slice(0, homoPt.length - 1);
                }
            }
            return new verb_core_NurbsSurfaceData(surface.degreeU, surface.degreeV, surface.knotsU.slice(), surface.knotsV.slice(), verb_eval_Eval.homogenize2d(pts, verb_eval_Eval.weight2d(surface.controlPoints)));
        };
        verb_eval_Modify.rationalCurveTransform = function (curve, mat) {
            var pts = verb_eval_Eval.dehomogenize1d(curve.controlPoints);
            var _g1 = 0;
            var _g = pts.length;
            while (_g1 < _g) {
                var i = _g1++;
                var homoPt = pts[i];
                homoPt.push(1.0);
                pts[i] = verb_core_Mat.dot(mat, homoPt).slice(0, homoPt.length - 1);
            }
            return new verb_core_NurbsCurveData(curve.degree, curve.knots.slice(), verb_eval_Eval.homogenize1d(pts, verb_eval_Eval.weight1d(curve.controlPoints)));
        };
        verb_eval_Modify.surfaceKnotRefine = function (surface, knotsToInsert, useV) {
            var newPts = [];
            var knots;
            var degree;
            var ctrlPts;
            if (!useV) {
                ctrlPts = verb_core_Mat.transpose(surface.controlPoints);
                knots = surface.knotsU;
                degree = surface.degreeU;
            }
            else {
                ctrlPts = surface.controlPoints;
                knots = surface.knotsV;
                degree = surface.degreeV;
            }
            var c = null;
            var _g = 0;
            while (_g < ctrlPts.length) {
                var cptrow = ctrlPts[_g];
                ++_g;
                c = verb_eval_Modify.curveKnotRefine(new verb_core_NurbsCurveData(degree, knots, cptrow), knotsToInsert);
                newPts.push(c.controlPoints);
            }
            var newknots = c.knots;
            if (!useV) {
                newPts = verb_core_Mat.transpose(newPts);
                return new verb_core_NurbsSurfaceData(surface.degreeU, surface.degreeV, newknots, surface.knotsV.slice(), newPts);
            }
            else
                return new verb_core_NurbsSurfaceData(surface.degreeU, surface.degreeV, surface.knotsU.slice(), newknots, newPts);
        };
        verb_eval_Modify.decomposeCurveIntoBeziers = function (curve) {
            var degree = curve.degree;
            var controlPoints = curve.controlPoints;
            var knots = curve.knots;
            var knotmults = verb_eval_Analyze.knotMultiplicities(knots);
            var reqMult = degree + 1;
            var _g = 0;
            while (_g < knotmults.length) {
                var knotmult = knotmults[_g];
                ++_g;
                if (knotmult.mult < reqMult) {
                    var knotsInsert = verb_core_Vec.rep(reqMult - knotmult.mult, knotmult.knot);
                    var res = verb_eval_Modify.curveKnotRefine(new verb_core_NurbsCurveData(degree, knots, controlPoints), knotsInsert);
                    knots = res.knots;
                    controlPoints = res.controlPoints;
                }
            }
            var numCrvs = knots.length / reqMult - 1;
            var crvKnotLength = reqMult * 2;
            var crvs = [];
            var i = 0;
            while (i < controlPoints.length) {
                var kts = knots.slice(i, i + crvKnotLength);
                var pts = controlPoints.slice(i, i + reqMult);
                crvs.push(new verb_core_NurbsCurveData(degree, kts, pts));
                i += reqMult;
            }
            return crvs;
        };
        verb_eval_Modify.curveKnotRefine = function (curve, knotsToInsert) {
            if (knotsToInsert.length == 0)
                return verb_eval_Make.clonedCurve(curve);
            var degree = curve.degree;
            var controlPoints = curve.controlPoints;
            var knots = curve.knots;
            var n = controlPoints.length - 1;
            var m = n + degree + 1;
            var r = knotsToInsert.length - 1;
            var a = verb_eval_Eval.knotSpan(degree, knotsToInsert[0], knots);
            var b = verb_eval_Eval.knotSpan(degree, knotsToInsert[r], knots);
            var controlPoints_post = [];
            var knots_post = [];
            var _g1 = 0;
            var _g = a - degree + 1;
            while (_g1 < _g) {
                var i1 = _g1++;
                controlPoints_post[i1] = controlPoints[i1];
            }
            var _g11 = b - 1;
            var _g2 = n + 1;
            while (_g11 < _g2) {
                var i2 = _g11++;
                controlPoints_post[i2 + r + 1] = controlPoints[i2];
            }
            var _g12 = 0;
            var _g3 = a + 1;
            while (_g12 < _g3) {
                var i3 = _g12++;
                knots_post[i3] = knots[i3];
            }
            var _g13 = b + degree;
            var _g4 = m + 1;
            while (_g13 < _g4) {
                var i4 = _g13++;
                knots_post[i4 + r + 1] = knots[i4];
            }
            var i = b + degree - 1;
            var k = b + degree + r;
            var j = r;
            while (j >= 0) {
                while (knotsToInsert[j] <= knots[i] && i > a) {
                    controlPoints_post[k - degree - 1] = controlPoints[i - degree - 1];
                    knots_post[k] = knots[i];
                    k = k - 1;
                    i = i - 1;
                }
                controlPoints_post[k - degree - 1] = controlPoints_post[k - degree];
                var _g14 = 1;
                var _g5 = degree + 1;
                while (_g14 < _g5) {
                    var l = _g14++;
                    var ind = k - degree + l;
                    var alfa = knots_post[k + l] - knotsToInsert[j];
                    if (Math.abs(alfa) < verb_core_Constants.EPSILON)
                        controlPoints_post[ind - 1] = controlPoints_post[ind];
                    else {
                        alfa = alfa / (knots_post[k + l] - knots[i - degree + l]);
                        controlPoints_post[ind - 1] = verb_core_Vec.add(verb_core_Vec.mul(alfa, controlPoints_post[ind - 1]), verb_core_Vec.mul(1.0 - alfa, controlPoints_post[ind]));
                    }
                }
                knots_post[k] = knotsToInsert[j];
                k = k - 1;
                j--;
            }
            return new verb_core_NurbsCurveData(degree, knots_post, controlPoints_post);
        };
        verb_eval_Modify.curveKnotInsert = function (curve, u, r) {
            var degree = curve.degree;
            var controlPoints = curve.controlPoints;
            var knots = curve.knots;
            var s = 0;
            var num_pts = controlPoints.length;
            var k = verb_eval_Eval.knotSpan(degree, u, knots);
            var num_pts_post = num_pts + r;
            var controlPoints_temp = [];
            var knots_post = [];
            var controlPoints_post = [];
            var i = 0;
            var _g1 = 1;
            var _g = k + 1;
            while (_g1 < _g) {
                var i1 = _g1++;
                knots_post[i1] = knots[i1];
            }
            var _g11 = 1;
            var _g2 = r + 1;
            while (_g11 < _g2) {
                var i2 = _g11++;
                knots_post[k + i2] = u;
            }
            var _g12 = k + 1;
            var _g3 = knots.length;
            while (_g12 < _g3) {
                var i3 = _g12++;
                knots_post[i3 + r] = knots[i3];
            }
            var _g13 = 0;
            var _g4 = k - degree + 1;
            while (_g13 < _g4) {
                var i4 = _g13++;
                controlPoints_post[i4] = controlPoints[i4];
            }
            var _g5 = k - s;
            while (_g5 < num_pts) {
                var i5 = _g5++;
                controlPoints_post[i5 + r] = controlPoints[i5];
            }
            var _g14 = 0;
            var _g6 = degree - s + 1;
            while (_g14 < _g6) {
                var i6 = _g14++;
                controlPoints_temp[i6] = controlPoints[k - degree + i6];
            }
            var L = 0;
            var alpha = 0;
            var _g15 = 1;
            var _g7 = r + 1;
            while (_g15 < _g7) {
                var j = _g15++;
                L = k - degree + j;
                var _g31 = 0;
                var _g21 = degree - j - s + 1;
                while (_g31 < _g21) {
                    var i7 = _g31++;
                    alpha = (u - knots[L + i7]) / (knots[i7 + k + 1] - knots[L + i7]);
                    controlPoints_temp[i7] = verb_core_Vec.add(verb_core_Vec.mul(alpha, controlPoints_temp[i7 + 1]), verb_core_Vec.mul(1.0 - alpha, controlPoints_temp[i7]));
                }
                controlPoints_post[L] = controlPoints_temp[0];
                controlPoints_post[k + r - j - s] = controlPoints_temp[degree - j - s];
            }
            var _g16 = L + 1;
            var _g8 = k - s;
            while (_g16 < _g8) {
                var i8 = _g16++;
                controlPoints_post[i8] = controlPoints_temp[i8 - L];
            }
            return new verb_core_NurbsCurveData(degree, knots_post, controlPoints_post);
        };
        var verb_eval_Tess = $hx_exports.eval.Tess = function () { };
        $hxClasses["verb.eval.Tess"] = verb_eval_Tess;
        verb_eval_Tess.__name__ = ["verb", "eval", "Tess"];
        verb_eval_Tess.rationalCurveRegularSample = function (curve, numSamples, includeU) {
            return verb_eval_Tess.rationalCurveRegularSampleRange(curve, curve.knots[0], verb_core_ArrayExtensions.last(curve.knots), numSamples, includeU);
        };
        verb_eval_Tess.rationalCurveRegularSampleRange = function (curve, start, end, numSamples, includeU) {
            if (numSamples < 1)
                numSamples = 2;
            var p = [];
            var span = (end - start) / (numSamples - 1);
            var u = 0;
            var _g = 0;
            while (_g < numSamples) {
                var i = _g++;
                u = start + span * i;
                if (includeU)
                    p.push([u].concat(verb_eval_Eval.rationalCurvePoint(curve, u)));
                else
                    p.push(verb_eval_Eval.rationalCurvePoint(curve, u));
            }
            return p;
        };
        verb_eval_Tess.rationalCurveAdaptiveSample = function (curve, tol, includeU) {
            if (includeU == null)
                includeU = false;
            if (tol == null)
                tol = 1e-6;
            if (curve.degree == 1) {
                if (!includeU)
                    return curve.controlPoints.map(verb_eval_Eval.dehomogenize);
                else {
                    var _g = [];
                    var _g2 = 0;
                    var _g1 = curve.controlPoints.length;
                    while (_g2 < _g1) {
                        var i = _g2++;
                        _g.push([curve.knots[i + 1]].concat(verb_eval_Eval.dehomogenize(curve.controlPoints[i])));
                    }
                    return _g;
                }
            }
            return verb_eval_Tess.rationalCurveAdaptiveSampleRange(curve, curve.knots[0], verb_core_ArrayExtensions.last(curve.knots), tol, includeU);
        };
        verb_eval_Tess.rationalCurveAdaptiveSampleRange = function (curve, start, end, tol, includeU) {
            var p1 = verb_eval_Eval.rationalCurvePoint(curve, start);
            var p3 = verb_eval_Eval.rationalCurvePoint(curve, end);
            var t = 0.5 + 0.2 * Math.random();
            var mid = start + (end - start) * t;
            var p2 = verb_eval_Eval.rationalCurvePoint(curve, mid);
            var diff = verb_core_Vec.sub(p1, p3);
            var diff2 = verb_core_Vec.sub(p1, p2);
            if (verb_core_Vec.dot(diff, diff) < tol && verb_core_Vec.dot(diff2, diff2) > tol || !verb_core_Trig.threePointsAreFlat(p1, p2, p3, tol)) {
                var exact_mid = start + (end - start) * 0.5;
                var left_pts = verb_eval_Tess.rationalCurveAdaptiveSampleRange(curve, start, exact_mid, tol, includeU);
                var right_pts = verb_eval_Tess.rationalCurveAdaptiveSampleRange(curve, exact_mid, end, tol, includeU);
                return left_pts.slice(0, -1).concat(right_pts);
            }
            else if (includeU)
                return [[start].concat(p1), [end].concat(p3)];
            else
                return [p1, p3];
        };
        verb_eval_Tess.rationalSurfaceNaive = function (surface, divs_u, divs_v) {
            if (divs_u < 1)
                divs_u = 1;
            if (divs_v < 1)
                divs_v = 1;
            var degreeU = surface.degreeU;
            var degreeV = surface.degreeV;
            var controlPoints = surface.controlPoints;
            var knotsU = surface.knotsU;
            var knotsV = surface.knotsV;
            var u_span = verb_core_ArrayExtensions.last(knotsU) - knotsU[0];
            var v_span = verb_core_ArrayExtensions.last(knotsV) - knotsV[0];
            var span_u = u_span / divs_u;
            var span_v = v_span / divs_v;
            var points = [];
            var uvs = [];
            var normals = [];
            var _g1 = 0;
            var _g = divs_u + 1;
            while (_g1 < _g) {
                var i = _g1++;
                var _g3 = 0;
                var _g2 = divs_v + 1;
                while (_g3 < _g2) {
                    var j = _g3++;
                    var pt_u = i * span_u;
                    var pt_v = j * span_v;
                    uvs.push([pt_u, pt_v]);
                    var derivs = verb_eval_Eval.rationalSurfaceDerivatives(surface, pt_u, pt_v, 1);
                    var pt = derivs[0][0];
                    points.push(pt);
                    var normal = verb_core_Vec.normalized(verb_core_Vec.cross(derivs[1][0], derivs[0][1]));
                    normals.push(normal);
                }
            }
            var faces = [];
            var _g4 = 0;
            while (_g4 < divs_u) {
                var i1 = _g4++;
                var _g11 = 0;
                while (_g11 < divs_v) {
                    var j1 = _g11++;
                    var a_i = i1 * (divs_v + 1) + j1;
                    var b_i = (i1 + 1) * (divs_v + 1) + j1;
                    var c_i = b_i + 1;
                    var d_i = a_i + 1;
                    var abc = [a_i, b_i, c_i];
                    var acd = [a_i, c_i, d_i];
                    faces.push(abc);
                    faces.push(acd);
                }
            }
            return new verb_core_MeshData(faces, points, normals, uvs);
        };
        verb_eval_Tess.divideRationalSurfaceAdaptive = function (surface, options) {
            if (options == null)
                options = new verb_eval_AdaptiveRefinementOptions();
            if (options.minDivsU != null)
                options.minDivsU = options.minDivsU;
            else
                options.minDivsU = 1;
            if (options.minDivsV != null)
                options.minDivsU = options.minDivsV;
            else
                options.minDivsU = 1;
            if (options.refine != null)
                options.refine = options.refine;
            else
                options.refine = true;
            var minU = (surface.controlPoints.length - 1) * 2;
            var minV = (surface.controlPoints[0].length - 1) * 2;
            var divsU;
            if (options.minDivsU > minU)
                divsU = options.minDivsU = options.minDivsU;
            else
                divsU = options.minDivsU = minU;
            var divsV;
            if (options.minDivsV > minV)
                divsV = options.minDivsV = options.minDivsV;
            else
                divsV = options.minDivsV = minV;
            var umax = verb_core_ArrayExtensions.last(surface.knotsU);
            var umin = surface.knotsU[0];
            var vmax = verb_core_ArrayExtensions.last(surface.knotsV);
            var vmin = surface.knotsV[0];
            var du = (umax - umin) / divsU;
            var dv = (vmax - vmin) / divsV;
            var divs = [];
            var pts = [];
            var _g1 = 0;
            var _g = divsV + 1;
            while (_g1 < _g) {
                var i = _g1++;
                var ptrow = [];
                var _g3 = 0;
                var _g2 = divsU + 1;
                while (_g3 < _g2) {
                    var j = _g3++;
                    var u = umin + du * j;
                    var v = vmin + dv * i;
                    var ds = verb_eval_Eval.rationalSurfaceDerivatives(surface, u, v, 1);
                    var norm = verb_core_Vec.normalized(verb_core_Vec.cross(ds[0][1], ds[1][0]));
                    ptrow.push(new verb_core_SurfacePoint(ds[0][0], norm, [u, v], -1, verb_core_Vec.isZero(norm)));
                }
                pts.push(ptrow);
            }
            var _g4 = 0;
            while (_g4 < divsV) {
                var i1 = _g4++;
                var _g11 = 0;
                while (_g11 < divsU) {
                    var j1 = _g11++;
                    var corners = [pts[divsV - i1 - 1][j1], pts[divsV - i1 - 1][j1 + 1], pts[divsV - i1][j1 + 1], pts[divsV - i1][j1]];
                    divs.push(new verb_eval_AdaptiveRefinementNode(surface, corners));
                }
            }
            if (!options.refine)
                return divs;
            var _g5 = 0;
            while (_g5 < divsV) {
                var i2 = _g5++;
                var _g12 = 0;
                while (_g12 < divsU) {
                    var j2 = _g12++;
                    var ci = i2 * divsU + j2;
                    var n = verb_eval_Tess.north(ci, i2, j2, divsU, divsV, divs);
                    var e = verb_eval_Tess.east(ci, i2, j2, divsU, divsV, divs);
                    var s = verb_eval_Tess.south(ci, i2, j2, divsU, divsV, divs);
                    var w = verb_eval_Tess.west(ci, i2, j2, divsU, divsV, divs);
                    divs[ci].neighbors = [s, e, n, w];
                    divs[ci].divide(options);
                }
            }
            return divs;
        };
        verb_eval_Tess.north = function (index, i, j, divsU, divsV, divs) {
            if (i == 0)
                return null;
            return divs[index - divsU];
        };
        verb_eval_Tess.south = function (index, i, j, divsU, divsV, divs) {
            if (i == divsV - 1)
                return null;
            return divs[index + divsU];
        };
        verb_eval_Tess.east = function (index, i, j, divsU, divsV, divs) {
            if (j == divsU - 1)
                return null;
            return divs[index + 1];
        };
        verb_eval_Tess.west = function (index, i, j, divsU, divsV, divs) {
            if (j == 0)
                return null;
            return divs[index - 1];
        };
        verb_eval_Tess.triangulateAdaptiveRefinementNodeTree = function (arrTree) {
            var mesh = verb_core_MeshData.empty();
            var _g = 0;
            while (_g < arrTree.length) {
                var x = arrTree[_g];
                ++_g;
                x.triangulate(mesh);
            }
            return mesh;
        };
        verb_eval_Tess.rationalSurfaceAdaptive = function (surface, options) {
            if (options != null)
                options = options;
            else
                options = new verb_eval_AdaptiveRefinementOptions();
            var arrTrees = verb_eval_Tess.divideRationalSurfaceAdaptive(surface, options);
            return verb_eval_Tess.triangulateAdaptiveRefinementNodeTree(arrTrees);
        };
        var verb_eval_AdaptiveRefinementOptions = $hx_exports.core.AdaptiveRefinementOptions = function () {
            this.minDivsV = 1;
            this.minDivsU = 1;
            this.refine = true;
            this.maxDepth = 10;
            this.minDepth = 0;
            this.normTol = 2.5e-2;
        };
        $hxClasses["verb.eval.AdaptiveRefinementOptions"] = verb_eval_AdaptiveRefinementOptions;
        verb_eval_AdaptiveRefinementOptions.__name__ = ["verb", "eval", "AdaptiveRefinementOptions"];
        verb_eval_AdaptiveRefinementOptions.prototype = {
            __class__: verb_eval_AdaptiveRefinementOptions
        };
        var verb_eval_AdaptiveRefinementNode = $hx_exports.core.AdaptiveRefinementNode = function (srf, corners, neighbors) {
            this.srf = srf;
            if (neighbors == null)
                this.neighbors = [null, null, null, null];
            else
                this.neighbors = neighbors;
            this.corners = corners;
            if (this.corners == null) {
                var u0 = srf.knotsU[0];
                var u1 = verb_core_ArrayExtensions.last(srf.knotsU);
                var v0 = srf.knotsV[0];
                var v1 = verb_core_ArrayExtensions.last(srf.knotsV);
                this.corners = [verb_core_SurfacePoint.fromUv(u0, v0), verb_core_SurfacePoint.fromUv(u1, v0), verb_core_SurfacePoint.fromUv(u1, v1), verb_core_SurfacePoint.fromUv(u0, v1)];
            }
        };
        $hxClasses["verb.eval.AdaptiveRefinementNode"] = verb_eval_AdaptiveRefinementNode;
        verb_eval_AdaptiveRefinementNode.__name__ = ["verb", "eval", "AdaptiveRefinementNode"];
        verb_eval_AdaptiveRefinementNode.prototype = {
            isLeaf: function () {
                return this.children == null;
            },
            center: function () {
                if (this.centerPoint != null)
                    return this.centerPoint;
                else
                    return this.evalSrf(this.u05, this.v05);
            },
            evalCorners: function () {
                this.u05 = (this.corners[0].uv[0] + this.corners[2].uv[0]) / 2;
                this.v05 = (this.corners[0].uv[1] + this.corners[2].uv[1]) / 2;
                var _g = 0;
                while (_g < 4) {
                    var i = _g++;
                    if (this.corners[i].point == null) {
                        var c = this.corners[i];
                        this.evalSrf(c.uv[0], c.uv[1], c);
                    }
                }
            },
            evalSrf: function (u, v, srfPt) {
                var derivs = verb_eval_Eval.rationalSurfaceDerivatives(this.srf, u, v, 1);
                var pt = derivs[0][0];
                var norm = verb_core_Vec.cross(derivs[0][1], derivs[1][0]);
                var degen = verb_core_Vec.isZero(norm);
                if (!degen)
                    norm = verb_core_Vec.normalized(norm);
                if (srfPt != null) {
                    srfPt.degen = degen;
                    srfPt.point = pt;
                    srfPt.normal = norm;
                    return srfPt;
                }
                else
                    return new verb_core_SurfacePoint(pt, norm, [u, v], -1, degen);
            },
            getEdgeCorners: function (edgeIndex) {
                if (this.isLeaf())
                    return [this.corners[edgeIndex]];
                if (this.horizontal)
                    switch (edgeIndex) {
                        case 0:
                            return this.children[0].getEdgeCorners(0);
                        case 1:
                            return this.children[0].getEdgeCorners(1).concat(this.children[1].getEdgeCorners(1));
                        case 2:
                            return this.children[1].getEdgeCorners(2);
                        case 3:
                            return this.children[1].getEdgeCorners(3).concat(this.children[0].getEdgeCorners(3));
                    }
                switch (edgeIndex) {
                    case 0:
                        return this.children[0].getEdgeCorners(0).concat(this.children[1].getEdgeCorners(0));
                    case 1:
                        return this.children[1].getEdgeCorners(1);
                    case 2:
                        return this.children[1].getEdgeCorners(2).concat(this.children[0].getEdgeCorners(2));
                    case 3:
                        return this.children[0].getEdgeCorners(3);
                }
                return null;
            },
            getAllCorners: function (edgeIndex) {
                var baseArr = [this.corners[edgeIndex]];
                if (this.neighbors[edgeIndex] == null)
                    return baseArr;
                var corners = this.neighbors[edgeIndex].getEdgeCorners((edgeIndex + 2) % 4);
                var funcIndex = edgeIndex % 2;
                var e = verb_core_Constants.EPSILON;
                var that = this;
                var rangeFuncMap = [function (c) {
                        return c.uv[0] > that.corners[0].uv[0] + e && c.uv[0] < that.corners[2].uv[0] - e;
                    }, function (c1) {
                        return c1.uv[1] > that.corners[0].uv[1] + e && c1.uv[1] < that.corners[2].uv[1] - e;
                    }];
                var cornercopy = corners.filter(rangeFuncMap[funcIndex]);
                cornercopy.reverse();
                return baseArr.concat(cornercopy);
            },
            midpoint: function (index) {
                if (this.midPoints == null)
                    this.midPoints = [null, null, null, null];
                if (!(this.midPoints[index] == null))
                    return this.midPoints[index];
                switch (index) {
                    case 0:
                        this.midPoints[0] = this.evalSrf(this.u05, this.corners[0].uv[1]);
                        break;
                    case 1:
                        this.midPoints[1] = this.evalSrf(this.corners[1].uv[0], this.v05);
                        break;
                    case 2:
                        this.midPoints[2] = this.evalSrf(this.u05, this.corners[2].uv[1]);
                        break;
                    case 3:
                        this.midPoints[3] = this.evalSrf(this.corners[0].uv[0], this.v05);
                        break;
                }
                return this.midPoints[index];
            },
            hasBadNormals: function () {
                return this.corners[0].degen || this.corners[1].degen || this.corners[2].degen || this.corners[3].degen;
            },
            fixNormals: function () {
                var l = this.corners.length;
                var _g = 0;
                while (_g < l) {
                    var i = _g++;
                    var corn = this.corners[i];
                    if (this.corners[i].degen) {
                        var v1 = this.corners[(i + 1) % l];
                        var v2 = this.corners[(i + 3) % l];
                        if (v1.degen)
                            this.corners[i].normal = v2.normal;
                        else
                            this.corners[i].normal = v1.normal;
                    }
                }
            },
            shouldDivide: function (options, currentDepth) {
                if (currentDepth < options.minDepth)
                    return true;
                if (currentDepth >= options.maxDepth)
                    return false;
                if (this.hasBadNormals()) {
                    this.fixNormals();
                    return false;
                }
                this.splitVert = verb_core_Vec.normSquared(verb_core_Vec.sub(this.corners[0].normal, this.corners[1].normal)) > options.normTol || verb_core_Vec.normSquared(verb_core_Vec.sub(this.corners[2].normal, this.corners[3].normal)) > options.normTol;
                this.splitHoriz = verb_core_Vec.normSquared(verb_core_Vec.sub(this.corners[1].normal, this.corners[2].normal)) > options.normTol || verb_core_Vec.normSquared(verb_core_Vec.sub(this.corners[3].normal, this.corners[0].normal)) > options.normTol;
                if (this.splitVert || this.splitHoriz)
                    return true;
                var center = this.center();
                return verb_core_Vec.normSquared(verb_core_Vec.sub(center.normal, this.corners[0].normal)) > options.normTol || verb_core_Vec.normSquared(verb_core_Vec.sub(center.normal, this.corners[1].normal)) > options.normTol || verb_core_Vec.normSquared(verb_core_Vec.sub(center.normal, this.corners[2].normal)) > options.normTol || verb_core_Vec.normSquared(verb_core_Vec.sub(center.normal, this.corners[3].normal)) > options.normTol;
            },
            divide: function (options) {
                if (options == null)
                    options = new verb_eval_AdaptiveRefinementOptions();
                if (options.normTol == null)
                    options.normTol = 8.5e-2;
                if (options.minDepth == null)
                    options.minDepth = 0;
                if (options.maxDepth == null)
                    options.maxDepth = 10;
                this._divide(options, 0, true);
            },
            _divide: function (options, currentDepth, horiz) {
                this.evalCorners();
                if (!this.shouldDivide(options, currentDepth))
                    return;
                currentDepth++;
                if (this.splitVert && !this.splitHoriz)
                    horiz = false;
                else if (!this.splitVert && this.splitHoriz)
                    horiz = true;
                this.horizontal = horiz;
                if (this.horizontal) {
                    var bott = [this.corners[0], this.corners[1], this.midpoint(1), this.midpoint(3)];
                    var top = [this.midpoint(3), this.midpoint(1), this.corners[2], this.corners[3]];
                    this.children = [new verb_eval_AdaptiveRefinementNode(this.srf, bott), new verb_eval_AdaptiveRefinementNode(this.srf, top)];
                    this.children[0].neighbors = [this.neighbors[0], this.neighbors[1], this.children[1], this.neighbors[3]];
                    this.children[1].neighbors = [this.children[0], this.neighbors[1], this.neighbors[2], this.neighbors[3]];
                }
                else {
                    var left = [this.corners[0], this.midpoint(0), this.midpoint(2), this.corners[3]];
                    var right = [this.midpoint(0), this.corners[1], this.corners[2], this.midpoint(2)];
                    this.children = [new verb_eval_AdaptiveRefinementNode(this.srf, left), new verb_eval_AdaptiveRefinementNode(this.srf, right)];
                    this.children[0].neighbors = [this.neighbors[0], this.children[1], this.neighbors[2], this.neighbors[3]];
                    this.children[1].neighbors = [this.neighbors[0], this.neighbors[1], this.neighbors[2], this.children[0]];
                }
                var _g = 0;
                var _g1 = this.children;
                while (_g < _g1.length) {
                    var child = _g1[_g];
                    ++_g;
                    child._divide(options, currentDepth, !horiz);
                }
            },
            triangulate: function (mesh) {
                if (mesh == null)
                    mesh = verb_core_MeshData.empty();
                if (this.isLeaf())
                    return this.triangulateLeaf(mesh);
                var _g = 0;
                var _g1 = this.children;
                while (_g < _g1.length) {
                    var x = _g1[_g];
                    ++_g;
                    if (x == null)
                        break;
                    x.triangulate(mesh);
                }
                return mesh;
            },
            triangulateLeaf: function (mesh) {
                var baseIndex = mesh.points.length;
                var uvs = [];
                var ids = [];
                var splitid = 0;
                var _g = 0;
                while (_g < 4) {
                    var i1 = _g++;
                    var edgeCorners = this.getAllCorners(i1);
                    if (edgeCorners.length == 2)
                        splitid = i1 + 1;
                    var _g2 = 0;
                    var _g1 = edgeCorners.length;
                    while (_g2 < _g1) {
                        var j1 = _g2++;
                        uvs.push(edgeCorners[j1]);
                    }
                }
                var _g3 = 0;
                while (_g3 < uvs.length) {
                    var corner = uvs[_g3];
                    ++_g3;
                    if (corner.id != -1) {
                        ids.push(corner.id);
                        continue;
                    }
                    mesh.uvs.push(corner.uv);
                    mesh.points.push(corner.point);
                    mesh.normals.push(corner.normal);
                    corner.id = baseIndex;
                    ids.push(baseIndex);
                    baseIndex++;
                }
                if (uvs.length == 4) {
                    mesh.faces.push([ids[0], ids[3], ids[1]]);
                    mesh.faces.push([ids[3], ids[2], ids[1]]);
                    return mesh;
                }
                else if (uvs.length == 5) {
                    var il = ids.length;
                    mesh.faces.push([ids[splitid], ids[(splitid + 2) % il], ids[(splitid + 1) % il]]);
                    mesh.faces.push([ids[(splitid + 4) % il], ids[(splitid + 3) % il], ids[splitid]]);
                    mesh.faces.push([ids[splitid], ids[(splitid + 3) % il], ids[(splitid + 2) % il]]);
                    return mesh;
                }
                var center = this.center();
                mesh.uvs.push(center.uv);
                mesh.points.push(center.point);
                mesh.normals.push(center.normal);
                var centerIndex = mesh.points.length - 1;
                var i = 0;
                var j = uvs.length - 1;
                while (i < uvs.length) {
                    mesh.faces.push([centerIndex, ids[i], ids[j]]);
                    j = i++;
                }
                return mesh;
            },
            __class__: verb_eval_AdaptiveRefinementNode
        };
        var verb_exe_Dispatcher = $hx_exports.exe.Dispatcher = function () { };
        $hxClasses["verb.exe.Dispatcher"] = verb_exe_Dispatcher;
        verb_exe_Dispatcher.__name__ = ["verb", "exe", "Dispatcher"];
        verb_exe_Dispatcher.init = function () {
            if (verb_exe_Dispatcher._init)
                return;
            verb_exe_Dispatcher._workerPool = new verb_exe_WorkerPool(verb_exe_Dispatcher.THREADS);
            verb_exe_Dispatcher._init = true;
        };
        verb_exe_Dispatcher.dispatchMethod = function (classType, methodName, args) {
            verb_exe_Dispatcher.init();
            var def = new promhx_Deferred();
            var callback = function (x) {
                def.resolve(x);
            };
            verb_exe_Dispatcher._workerPool.addWork(Type.getClassName(classType), methodName, args, callback);
            return new promhx_Promise(def);
        };
        var verb_exe_WorkerPool = $hx_exports.exe.WorkerPool = function (numThreads, fileName) {
            if (fileName == null)
                fileName = "verb.js";
            if (numThreads == null)
                numThreads = 1;
            this._callbacks = new haxe_ds_IntMap();
            this._working = new haxe_ds_IntMap();
            this._pool = [];
            this._queue = [];
            var _g = 0;
            while (_g < numThreads) {
                var i = _g++;
                var w;
                try {
                    w = new Worker(verb_exe_WorkerPool.basePath + fileName);
                }
                catch (e) {
                    if (e instanceof js__$Boot_HaxeError)
                        e = e.val;
                    w = new Worker(verb_exe_WorkerPool.basePath + fileName.substring(0, -3) + ".min.js");
                }
                this._pool.push(w);
            }
        };
        $hxClasses["verb.exe.WorkerPool"] = verb_exe_WorkerPool;
        verb_exe_WorkerPool.__name__ = ["verb", "exe", "WorkerPool"];
        verb_exe_WorkerPool.prototype = {
            addWork: function (className, methodName, args, callback) {
                var work = new verb_exe__$WorkerPool_Work(className, methodName, args);
                this._callbacks.set(work.id, callback);
                this._queue.push(work);
                this.processQueue();
            },
            processQueue: function () {
                var _g = this;
                while (this._queue.length > 0 && this._pool.length > 0) {
                    var work = this._queue.shift();
                    var workId = [work.id];
                    var worker = [this._pool.shift()];
                    this._working.h[workId[0]] = worker[0];
                    worker[0].onmessage = (function (worker, workId) {
                        return function (e) {
                            _g._working.remove(workId[0]);
                            _g._pool.push(worker[0]);
                            try {
                                if (_g._callbacks.h.hasOwnProperty(workId[0])) {
                                    _g._callbacks.h[workId[0]](e.data.result);
                                    _g._callbacks.remove(workId[0]);
                                }
                            }
                            catch (error) {
                                if (error instanceof js__$Boot_HaxeError)
                                    error = error.val;
                                console.log(error);
                            }
                            _g.processQueue();
                        };
                    })(worker, workId);
                    worker[0].postMessage(work);
                }
            },
            __class__: verb_exe_WorkerPool
        };
        var verb_exe__$WorkerPool_Work = function (className, methodName, args) {
            this.className = className;
            this.methodName = methodName;
            this.args = args;
            this.id = verb_exe__$WorkerPool_Work.uuid++;
        };
        $hxClasses["verb.exe._WorkerPool.Work"] = verb_exe__$WorkerPool_Work;
        verb_exe__$WorkerPool_Work.__name__ = ["verb", "exe", "_WorkerPool", "Work"];
        verb_exe__$WorkerPool_Work.prototype = {
            __class__: verb_exe__$WorkerPool_Work
        };
        var verb_geom_ICurve = function () { };
        $hxClasses["verb.geom.ICurve"] = verb_geom_ICurve;
        verb_geom_ICurve.__name__ = ["verb", "geom", "ICurve"];
        verb_geom_ICurve.__interfaces__ = [verb_core_ISerializable];
        verb_geom_ICurve.prototype = {
            __class__: verb_geom_ICurve
        };
        var verb_geom_NurbsCurve = $hx_exports.geom.NurbsCurve = function (data) {
            this._data = verb_eval_Check.isValidNurbsCurveData(data);
        };
        $hxClasses["verb.geom.NurbsCurve"] = verb_geom_NurbsCurve;
        verb_geom_NurbsCurve.__name__ = ["verb", "geom", "NurbsCurve"];
        verb_geom_NurbsCurve.__interfaces__ = [verb_geom_ICurve];
        verb_geom_NurbsCurve.byKnotsControlPointsWeights = function (degree, knots, controlPoints, weights) {
            return new verb_geom_NurbsCurve(new verb_core_NurbsCurveData(degree, knots.slice(), verb_eval_Eval.homogenize1d(controlPoints, weights)));
        };
        verb_geom_NurbsCurve.byPoints = function (points, degree) {
            if (degree == null)
                degree = 3;
            return new verb_geom_NurbsCurve(verb_eval_Make.rationalInterpCurve(points, degree));
        };
        verb_geom_NurbsCurve.__super__ = verb_core_SerializableBase;
        verb_geom_NurbsCurve.prototype = $extend(verb_core_SerializableBase.prototype, {
            degree: function () {
                return this._data.degree;
            },
            knots: function () {
                return this._data.knots.slice(0);
            },
            controlPoints: function () {
                return verb_eval_Eval.dehomogenize1d(this._data.controlPoints);
            },
            weights: function () {
                return verb_eval_Eval.weight1d(this._data.controlPoints);
            },
            asNurbs: function () {
                return new verb_core_NurbsCurveData(this.degree(), this.knots(), verb_eval_Eval.homogenize1d(this.controlPoints(), this.weights()));
            },
            clone: function () {
                return new verb_geom_NurbsCurve(this._data);
            },
            domain: function () {
                return new verb_core_Interval(verb_core_ArrayExtensions.first(this._data.knots), verb_core_ArrayExtensions.last(this._data.knots));
            },
            transform: function (mat) {
                return new verb_geom_NurbsCurve(verb_eval_Modify.rationalCurveTransform(this._data, mat));
            },
            transformAsync: function (mat) {
                return verb_exe_Dispatcher.dispatchMethod(verb_eval_Modify, "rationalCurveTransform", [this._data, mat]).then(function (x) {
                    return new verb_geom_NurbsCurve(x);
                });
            },
            point: function (u) {
                return verb_eval_Eval.rationalCurvePoint(this._data, u);
            },
            pointAsync: function (u) {
                return verb_exe_Dispatcher.dispatchMethod(verb_eval_Eval, "rationalCurvePoint", [this._data, u]);
            },
            tangent: function (u) {
                return verb_eval_Eval.rationalCurveTangent(this._data, u);
            },
            tangentAsync: function (u) {
                return verb_exe_Dispatcher.dispatchMethod(verb_eval_Eval, "rationalCurveTangent", [this._data, u]);
            },
            derivatives: function (u, numDerivs) {
                if (numDerivs == null)
                    numDerivs = 1;
                return verb_eval_Eval.rationalCurveDerivatives(this._data, u, numDerivs);
            },
            derivativesAsync: function (u, numDerivs) {
                if (numDerivs == null)
                    numDerivs = 1;
                return verb_exe_Dispatcher.dispatchMethod(verb_eval_Eval, "rationalCurveDerivatives", [this._data, u, numDerivs]);
            },
            closestPoint: function (pt) {
                return verb_eval_Analyze.rationalCurveClosestPoint(this._data, pt);
            },
            closestPointAsync: function (pt) {
                return verb_exe_Dispatcher.dispatchMethod(verb_eval_Analyze, "rationalCurveClosestPoint", [this._data, pt]);
            },
            closestParam: function (pt) {
                return verb_eval_Analyze.rationalCurveClosestParam(this._data, pt);
            },
            closestParamAsync: function (pt) {
                return verb_exe_Dispatcher.dispatchMethod(verb_eval_Analyze, "rationalCurveClosestParam", [this._data, pt]);
            },
            length: function () {
                return verb_eval_Analyze.rationalCurveArcLength(this._data);
            },
            lengthAsync: function () {
                return verb_exe_Dispatcher.dispatchMethod(verb_eval_Analyze, "rationalCurveArcLength", [this._data]);
            },
            lengthAtParam: function (u) {
                return verb_eval_Analyze.rationalCurveArcLength(this._data, u);
            },
            lengthAtParamAsync: function () {
                return verb_exe_Dispatcher.dispatchMethod(verb_eval_Analyze, "rationalCurveArcLength", [this._data]);
            },
            paramAtLength: function (len, tolerance) {
                return verb_eval_Analyze.rationalCurveParamAtArcLength(this._data, len, tolerance);
            },
            paramAtLengthAsync: function (len, tolerance) {
                return verb_exe_Dispatcher.dispatchMethod(verb_eval_Analyze, "rationalCurveParamAtArcLength", [this._data, len, tolerance]);
            },
            divideByEqualArcLength: function (divisions) {
                return verb_eval_Divide.rationalCurveByEqualArcLength(this._data, divisions);
            },
            divideByEqualArcLengthAsync: function (divisions) {
                return verb_exe_Dispatcher.dispatchMethod(verb_eval_Divide, "rationalCurveByEqualArcLength", [this._data, divisions]);
            },
            divideByArcLength: function (arcLength) {
                return verb_eval_Divide.rationalCurveByArcLength(this._data, arcLength);
            },
            divideByArcLengthAsync: function (divisions) {
                return verb_exe_Dispatcher.dispatchMethod(verb_eval_Divide, "rationalCurveByArcLength", [this._data, divisions]);
            },
            split: function (u) {
                return verb_eval_Divide.curveSplit(this._data, u).map(function (x) {
                    return new verb_geom_NurbsCurve(x);
                });
            },
            splitAsync: function (u) {
                return verb_exe_Dispatcher.dispatchMethod(verb_eval_Divide, "curveSplit", [this._data, u]).then(function (cs) {
                    return cs.map(function (x) {
                        return new verb_geom_NurbsCurve(x);
                    });
                });
            },
            reverse: function () {
                return new verb_geom_NurbsCurve(verb_eval_Modify.curveReverse(this._data));
            },
            reverseAsync: function () {
                return verb_exe_Dispatcher.dispatchMethod(verb_eval_Modify, "curveReverse", [this._data]).then(function (c) {
                    return new verb_geom_NurbsCurve(c);
                });
            },
            tessellate: function (tolerance) {
                return verb_eval_Tess.rationalCurveAdaptiveSample(this._data, tolerance, false);
            },
            tessellateAsync: function (tolerance) {
                return verb_exe_Dispatcher.dispatchMethod(verb_eval_Tess, "rationalCurveAdaptiveSample", [this._data, tolerance, false]);
            },
            __class__: verb_geom_NurbsCurve
        });
        var verb_geom_Arc = $hx_exports.geom.Arc = function (center, xaxis, yaxis, radius, minAngle, maxAngle) {
            verb_geom_NurbsCurve.call(this, verb_eval_Make.arc(center, xaxis, yaxis, radius, minAngle, maxAngle));
            this._center = center;
            this._xaxis = xaxis;
            this._yaxis = yaxis;
            this._radius = radius;
            this._minAngle = minAngle;
            this._maxAngle = maxAngle;
        };
        $hxClasses["verb.geom.Arc"] = verb_geom_Arc;
        verb_geom_Arc.__name__ = ["verb", "geom", "Arc"];
        verb_geom_Arc.__super__ = verb_geom_NurbsCurve;
        verb_geom_Arc.prototype = $extend(verb_geom_NurbsCurve.prototype, {
            center: function () {
                return this._center;
            },
            xaxis: function () {
                return this._xaxis;
            },
            yaxis: function () {
                return this._yaxis;
            },
            radius: function () {
                return this._radius;
            },
            minAngle: function () {
                return this._minAngle;
            },
            maxAngle: function () {
                return this._maxAngle;
            },
            __class__: verb_geom_Arc
        });
        var verb_geom_BezierCurve = $hx_exports.geom.BezierCurve = function (points, weights) {
            verb_geom_NurbsCurve.call(this, verb_eval_Make.rationalBezierCurve(points, weights));
        };
        $hxClasses["verb.geom.BezierCurve"] = verb_geom_BezierCurve;
        verb_geom_BezierCurve.__name__ = ["verb", "geom", "BezierCurve"];
        verb_geom_BezierCurve.__super__ = verb_geom_NurbsCurve;
        verb_geom_BezierCurve.prototype = $extend(verb_geom_NurbsCurve.prototype, {
            __class__: verb_geom_BezierCurve
        });
        var verb_geom_Circle = $hx_exports.geom.Circle = function (center, xaxis, yaxis, radius) {
            verb_geom_Arc.call(this, center, xaxis, yaxis, radius, 0, Math.PI * 2);
        };
        $hxClasses["verb.geom.Circle"] = verb_geom_Circle;
        verb_geom_Circle.__name__ = ["verb", "geom", "Circle"];
        verb_geom_Circle.__super__ = verb_geom_Arc;
        verb_geom_Circle.prototype = $extend(verb_geom_Arc.prototype, {
            __class__: verb_geom_Circle
        });
        var verb_geom_ISurface = function () { };
        $hxClasses["verb.geom.ISurface"] = verb_geom_ISurface;
        verb_geom_ISurface.__name__ = ["verb", "geom", "ISurface"];
        verb_geom_ISurface.__interfaces__ = [verb_core_ISerializable];
        verb_geom_ISurface.prototype = {
            __class__: verb_geom_ISurface
        };
        var verb_geom_NurbsSurface = $hx_exports.geom.NurbsSurface = function (data) {
            this._data = verb_eval_Check.isValidNurbsSurfaceData(data);
        };
        $hxClasses["verb.geom.NurbsSurface"] = verb_geom_NurbsSurface;
        verb_geom_NurbsSurface.__name__ = ["verb", "geom", "NurbsSurface"];
        verb_geom_NurbsSurface.__interfaces__ = [verb_geom_ISurface];
        verb_geom_NurbsSurface.byKnotsControlPointsWeights = function (degreeU, degreeV, knotsU, knotsV, controlPoints, weights) {
            return new verb_geom_NurbsSurface(new verb_core_NurbsSurfaceData(degreeU, degreeV, knotsU, knotsV, verb_eval_Eval.homogenize2d(controlPoints, weights)));
        };
        verb_geom_NurbsSurface.byCorners = function (point0, point1, point2, point3) {
            return new verb_geom_NurbsSurface(verb_eval_Make.fourPointSurface(point0, point1, point2, point3));
        };
        verb_geom_NurbsSurface.byLoftingCurves = function (curves, degreeV) {
            return new verb_geom_NurbsSurface(verb_eval_Make.loftedSurface((function ($this) {
                var $r;
                var _g = [];
                {
                    var _g1 = 0;
                    while (_g1 < curves.length) {
                        var c = curves[_g1];
                        ++_g1;
                        _g.push(c.asNurbs());
                    }
                }
                $r = _g;
                return $r;
            }(this)), degreeV));
        };
        verb_geom_NurbsSurface.__super__ = verb_core_SerializableBase;
        verb_geom_NurbsSurface.prototype = $extend(verb_core_SerializableBase.prototype, {
            degreeU: function () {
                return this._data.degreeU;
            },
            degreeV: function () {
                return this._data.degreeV;
            },
            knotsU: function () {
                return this._data.knotsU.slice(0);
            },
            knotsV: function () {
                return this._data.knotsV.slice(0);
            },
            controlPoints: function () {
                return verb_eval_Eval.dehomogenize2d(this._data.controlPoints);
            },
            weights: function () {
                return verb_eval_Eval.weight2d(this._data.controlPoints);
            },
            asNurbs: function () {
                return new verb_core_NurbsSurfaceData(this.degreeU(), this.degreeV(), this.knotsU(), this.knotsV(), verb_eval_Eval.homogenize2d(this.controlPoints(), this.weights()));
            },
            clone: function () {
                return new verb_geom_NurbsSurface(this.asNurbs());
            },
            domainU: function () {
                return new verb_core_Interval(verb_core_ArrayExtensions.first(this._data.knotsU), verb_core_ArrayExtensions.last(this._data.knotsU));
            },
            domainV: function () {
                return new verb_core_Interval(verb_core_ArrayExtensions.first(this._data.knotsV), verb_core_ArrayExtensions.last(this._data.knotsV));
            },
            point: function (u, v) {
                return verb_eval_Eval.rationalSurfacePoint(this._data, u, v);
            },
            pointAsync: function (u, v) {
                return verb_exe_Dispatcher.dispatchMethod(verb_eval_Eval, "rationalSurfacePoint", [this._data, u, v]);
            },
            normal: function (u, v) {
                return verb_eval_Eval.rationalSurfaceNormal(this._data, u, v);
            },
            normalAsync: function (u, v) {
                return verb_exe_Dispatcher.dispatchMethod(verb_eval_Eval, "rationalSurfaceNormal", [this._data, u, v]);
            },
            derivatives: function (u, v, numDerivs) {
                if (numDerivs == null)
                    numDerivs = 1;
                return verb_eval_Eval.rationalSurfaceDerivatives(this._data, u, v, numDerivs);
            },
            derivativesAsync: function (u, v, numDerivs) {
                if (numDerivs == null)
                    numDerivs = 1;
                return verb_exe_Dispatcher.dispatchMethod(verb_eval_Eval, "rationalSurfaceDerivatives", [this._data, u, v, numDerivs]);
            },
            closestParam: function (pt) {
                return verb_eval_Analyze.rationalSurfaceClosestParam(this._data, pt);
            },
            closestParamAsync: function (pt) {
                return verb_exe_Dispatcher.dispatchMethod(verb_eval_Analyze, "rationalSurfaceClosestParam", [this._data, pt]);
            },
            closestPoint: function (pt) {
                return verb_eval_Analyze.rationalSurfaceClosestPoint(this._data, pt);
            },
            closestPointAsync: function (pt) {
                return verb_exe_Dispatcher.dispatchMethod(verb_eval_Analyze, "rationalSurfaceClosestPoint", [this._data, pt]);
            },
            split: function (u, useV) {
                if (useV == null)
                    useV = false;
                return verb_eval_Divide.surfaceSplit(this._data, u, useV).map(function (x) {
                    return new verb_geom_NurbsSurface(x);
                });
            },
            splitAsync: function (u, useV) {
                if (useV == null)
                    useV = false;
                return verb_exe_Dispatcher.dispatchMethod(verb_eval_Divide, "surfaceSplit", [this._data, u, useV]).then(function (s) {
                    return s.map(function (x) {
                        return new verb_geom_NurbsSurface(x);
                    });
                });
            },
            reverse: function (useV) {
                if (useV == null)
                    useV = false;
                return new verb_geom_NurbsSurface(verb_eval_Modify.surfaceReverse(this._data, useV));
            },
            reverseAsync: function (useV) {
                if (useV == null)
                    useV = false;
                return verb_exe_Dispatcher.dispatchMethod(verb_eval_Modify, "surfaceReverse", [this._data, useV]).then(function (c) {
                    return new verb_geom_NurbsSurface(c);
                });
            },
            isocurve: function (u, useV) {
                if (useV == null)
                    useV = false;
                return new verb_geom_NurbsCurve(verb_eval_Make.surfaceIsocurve(this._data, u, useV));
            },
            isocurveAsync: function (u, useV) {
                if (useV == null)
                    useV = false;
                return verb_exe_Dispatcher.dispatchMethod(verb_eval_Make, "surfaceIsocurve", [this._data, u, useV]).then(function (x) {
                    return new verb_geom_NurbsCurve(x);
                });
            },
            boundaries: function (options) {
                return verb_eval_Make.surfaceBoundaryCurves(this._data).map(function (x) {
                    return new verb_geom_NurbsCurve(x);
                });
            },
            boundariesAsync: function (options) {
                return verb_exe_Dispatcher.dispatchMethod(verb_eval_Make, "surfaceBoundaryCurves", [this._data]).then(function (cs) {
                    return cs.map(function (x) {
                        return new verb_geom_NurbsCurve(x);
                    });
                });
            },
            tessellate: function (options) {
                return verb_eval_Tess.rationalSurfaceAdaptive(this._data, options);
            },
            tessellateAsync: function (options) {
                return verb_exe_Dispatcher.dispatchMethod(verb_eval_Tess, "rationalSurfaceAdaptive", [this._data, options]);
            },
            transform: function (mat) {
                return new verb_geom_NurbsSurface(verb_eval_Modify.rationalSurfaceTransform(this._data, mat));
            },
            transformAsync: function (mat) {
                return verb_exe_Dispatcher.dispatchMethod(verb_eval_Modify, "rationalSurfaceTransform", [this._data, mat]).then(function (x) {
                    return new verb_geom_NurbsSurface(x);
                });
            },
            __class__: verb_geom_NurbsSurface
        });
        var verb_geom_ConicalSurface = $hx_exports.geom.ConicalSurface = function (axis, xaxis, base, height, radius) {
            verb_geom_NurbsSurface.call(this, verb_eval_Make.conicalSurface(axis, xaxis, base, height, radius));
            this._axis = axis;
            this._xaxis = xaxis;
            this._base = base;
            this._height = height;
            this._radius = radius;
        };
        $hxClasses["verb.geom.ConicalSurface"] = verb_geom_ConicalSurface;
        verb_geom_ConicalSurface.__name__ = ["verb", "geom", "ConicalSurface"];
        verb_geom_ConicalSurface.__super__ = verb_geom_NurbsSurface;
        verb_geom_ConicalSurface.prototype = $extend(verb_geom_NurbsSurface.prototype, {
            axis: function () {
                return this._axis;
            },
            xaxis: function () {
                return this._xaxis;
            },
            base: function () {
                return this._base;
            },
            height: function () {
                return this._height;
            },
            radius: function () {
                return this._radius;
            },
            __class__: verb_geom_ConicalSurface
        });
        var verb_geom_CylindricalSurface = $hx_exports.geom.CylindricalSurface = function (axis, xaxis, base, height, radius) {
            verb_geom_NurbsSurface.call(this, verb_eval_Make.cylindricalSurface(axis, xaxis, base, height, radius));
            this._axis = axis;
            this._xaxis = xaxis;
            this._base = base;
            this._height = height;
            this._radius = radius;
        };
        $hxClasses["verb.geom.CylindricalSurface"] = verb_geom_CylindricalSurface;
        verb_geom_CylindricalSurface.__name__ = ["verb", "geom", "CylindricalSurface"];
        verb_geom_CylindricalSurface.__super__ = verb_geom_NurbsSurface;
        verb_geom_CylindricalSurface.prototype = $extend(verb_geom_NurbsSurface.prototype, {
            axis: function () {
                return this._axis;
            },
            xaxis: function () {
                return this._xaxis;
            },
            base: function () {
                return this._base;
            },
            height: function () {
                return this._height;
            },
            radius: function () {
                return this._radius;
            },
            __class__: verb_geom_CylindricalSurface
        });
        var verb_geom_EllipseArc = $hx_exports.geom.EllipseArc = function (center, xaxis, yaxis, minAngle, maxAngle) {
            verb_geom_NurbsCurve.call(this, verb_eval_Make.ellipseArc(center, xaxis, yaxis, minAngle, maxAngle));
            this._center = center;
            this._xaxis = xaxis;
            this._yaxis = yaxis;
            this._minAngle = minAngle;
            this._maxAngle = maxAngle;
        };
        $hxClasses["verb.geom.EllipseArc"] = verb_geom_EllipseArc;
        verb_geom_EllipseArc.__name__ = ["verb", "geom", "EllipseArc"];
        verb_geom_EllipseArc.__super__ = verb_geom_NurbsCurve;
        verb_geom_EllipseArc.prototype = $extend(verb_geom_NurbsCurve.prototype, {
            center: function () {
                return this._center;
            },
            xaxis: function () {
                return this._xaxis;
            },
            yaxis: function () {
                return this._yaxis;
            },
            minAngle: function () {
                return this._minAngle;
            },
            maxAngle: function () {
                return this._maxAngle;
            },
            __class__: verb_geom_EllipseArc
        });
        var verb_geom_Ellipse = $hx_exports.geom.Ellipse = function (center, xaxis, yaxis) {
            verb_geom_EllipseArc.call(this, center, xaxis, yaxis, 0, Math.PI * 2);
        };
        $hxClasses["verb.geom.Ellipse"] = verb_geom_Ellipse;
        verb_geom_Ellipse.__name__ = ["verb", "geom", "Ellipse"];
        verb_geom_Ellipse.__super__ = verb_geom_EllipseArc;
        verb_geom_Ellipse.prototype = $extend(verb_geom_EllipseArc.prototype, {
            __class__: verb_geom_Ellipse
        });
        var verb_geom_ExtrudedSurface = $hx_exports.geom.ExtrudedSurface = function (profile, direction) {
            verb_geom_NurbsSurface.call(this, verb_eval_Make.extrudedSurface(verb_core_Vec.normalized(direction), verb_core_Vec.norm(direction), profile.asNurbs()));
            this._profile = profile;
            this._direction = direction;
        };
        $hxClasses["verb.geom.ExtrudedSurface"] = verb_geom_ExtrudedSurface;
        verb_geom_ExtrudedSurface.__name__ = ["verb", "geom", "ExtrudedSurface"];
        verb_geom_ExtrudedSurface.__super__ = verb_geom_NurbsSurface;
        verb_geom_ExtrudedSurface.prototype = $extend(verb_geom_NurbsSurface.prototype, {
            profile: function () {
                return this._profile;
            },
            direction: function () {
                return this._direction;
            },
            __class__: verb_geom_ExtrudedSurface
        });
        var verb_geom_Intersect = $hx_exports.geom.Intersect = function () { };
        $hxClasses["verb.geom.Intersect"] = verb_geom_Intersect;
        verb_geom_Intersect.__name__ = ["verb", "geom", "Intersect"];
        verb_geom_Intersect.curves = function (first, second, tol) {
            if (tol == null)
                tol = 1e-3;
            return verb_eval_Intersect.curves(first.asNurbs(), second.asNurbs(), tol);
        };
        verb_geom_Intersect.curvesAsync = function (first, second, tol) {
            if (tol == null)
                tol = 1e-3;
            return verb_exe_Dispatcher.dispatchMethod(verb_eval_Intersect, "curves", [first.asNurbs(), second.asNurbs(), tol]);
        };
        verb_geom_Intersect.curveAndSurface = function (curve, surface, tol) {
            if (tol == null)
                tol = 1e-3;
            return verb_eval_Intersect.curveAndSurface(curve.asNurbs(), surface.asNurbs(), tol);
        };
        verb_geom_Intersect.curveAndSurfaceAsync = function (curve, surface, tol) {
            if (tol == null)
                tol = 1e-3;
            return verb_exe_Dispatcher.dispatchMethod(verb_eval_Intersect, "curveAndSurface", [curve.asNurbs(), surface.asNurbs(), tol]);
        };
        verb_geom_Intersect.surfaces = function (first, second, tol) {
            if (tol == null)
                tol = 1e-3;
            return verb_eval_Intersect.surfaces(first.asNurbs(), second.asNurbs(), tol).map(function (cd) {
                return new verb_geom_NurbsCurve(cd);
            });
        };
        verb_geom_Intersect.surfacesAsync = function (first, second, tol) {
            if (tol == null)
                tol = 1e-3;
            return verb_exe_Dispatcher.dispatchMethod(verb_eval_Intersect, "surfaces", [first.asNurbs(), second.asNurbs(), tol]).then(function (cds) {
                return cds.map(function (cd) {
                    return new verb_geom_NurbsCurve(cd);
                });
            });
        };
        var verb_geom_Line = $hx_exports.geom.Line = function (start, end) {
            verb_geom_NurbsCurve.call(this, verb_eval_Make.polyline([start, end]));
            this._start = start;
            this._end = end;
        };
        $hxClasses["verb.geom.Line"] = verb_geom_Line;
        verb_geom_Line.__name__ = ["verb", "geom", "Line"];
        verb_geom_Line.__super__ = verb_geom_NurbsCurve;
        verb_geom_Line.prototype = $extend(verb_geom_NurbsCurve.prototype, {
            start: function () {
                return this._start;
            },
            end: function () {
                return this._end;
            },
            __class__: verb_geom_Line
        });
        var verb_geom_RevolvedSurface = $hx_exports.geom.RevolvedSurface = function (profile, center, axis, angle) {
            verb_geom_NurbsSurface.call(this, verb_eval_Make.revolvedSurface(profile.asNurbs(), center, axis, angle));
            this._profile = profile;
            this._center = center;
            this._axis = axis;
            this._angle = angle;
        };
        $hxClasses["verb.geom.RevolvedSurface"] = verb_geom_RevolvedSurface;
        verb_geom_RevolvedSurface.__name__ = ["verb", "geom", "RevolvedSurface"];
        verb_geom_RevolvedSurface.__super__ = verb_geom_NurbsSurface;
        verb_geom_RevolvedSurface.prototype = $extend(verb_geom_NurbsSurface.prototype, {
            profile: function () {
                return this._profile;
            },
            center: function () {
                return this._center;
            },
            axis: function () {
                return this._center;
            },
            angle: function () {
                return this._angle;
            },
            __class__: verb_geom_RevolvedSurface
        });
        var verb_geom_SphericalSurface = $hx_exports.geom.SphericalSurface = function (center, radius) {
            verb_geom_NurbsSurface.call(this, verb_eval_Make.sphericalSurface(center, [0, 0, 1], [1, 0, 0], radius));
            this._center = center;
            this._radius = radius;
        };
        $hxClasses["verb.geom.SphericalSurface"] = verb_geom_SphericalSurface;
        verb_geom_SphericalSurface.__name__ = ["verb", "geom", "SphericalSurface"];
        verb_geom_SphericalSurface.__super__ = verb_geom_NurbsSurface;
        verb_geom_SphericalSurface.prototype = $extend(verb_geom_NurbsSurface.prototype, {
            center: function () {
                return this._center;
            },
            radius: function () {
                return this._radius;
            },
            __class__: verb_geom_SphericalSurface
        });
        var verb_geom_SweptSurface = $hx_exports.geom.SweptSurface = function (profile, rail) {
            verb_geom_NurbsSurface.call(this, verb_eval_Make.rationalTranslationalSurface(profile.asNurbs(), rail.asNurbs()));
            this._profile = profile;
            this._rail = rail;
        };
        $hxClasses["verb.geom.SweptSurface"] = verb_geom_SweptSurface;
        verb_geom_SweptSurface.__name__ = ["verb", "geom", "SweptSurface"];
        verb_geom_SweptSurface.__super__ = verb_geom_NurbsSurface;
        verb_geom_SweptSurface.prototype = $extend(verb_geom_NurbsSurface.prototype, {
            profile: function () {
                return this._profile;
            },
            rail: function () {
                return this._rail;
            },
            __class__: verb_geom_SweptSurface
        });
        function $iterator(o) { if (o instanceof Array)
            return function () { return HxOverrides.iter(o); }; return typeof (o.iterator) == 'function' ? $bind(o, o.iterator) : o.iterator; }
        var $_, $fid = 0;
        function $bind(o, m) { if (m == null)
            return null; if (m.__id__ == null)
            m.__id__ = $fid++; var f; if (o.hx__closures__ == null)
            o.hx__closures__ = {};
        else
            f = o.hx__closures__[m.__id__]; if (f == null) {
            f = function () { return f.method.apply(f.scope, arguments); };
            f.scope = o;
            f.method = m;
            o.hx__closures__[m.__id__] = f;
        } return f; }
        $hxClasses.Math = Math;
        String.prototype.__class__ = $hxClasses.String = String;
        String.__name__ = ["String"];
        $hxClasses.Array = Array;
        Array.__name__ = ["Array"];
        Date.prototype.__class__ = $hxClasses.Date = Date;
        Date.__name__ = ["Date"];
        var Int = $hxClasses.Int = { __name__: ["Int"] };
        var Dynamic = $hxClasses.Dynamic = { __name__: ["Dynamic"] };
        var Float = $hxClasses.Float = Number;
        Float.__name__ = ["Float"];
        var Bool = $hxClasses.Bool = Boolean;
        Bool.__ename__ = ["Bool"];
        var Class = $hxClasses.Class = { __name__: ["Class"] };
        var Enum = {};
        if (Array.prototype.map == null)
            Array.prototype.map = function (f) {
                var a = [];
                var _g1 = 0;
                var _g = this.length;
                while (_g1 < _g) {
                    var i = _g1++;
                    a[i] = f(this[i]);
                }
                return a;
            };
        if (Array.prototype.filter == null)
            Array.prototype.filter = function (f1) {
                var a1 = [];
                var _g11 = 0;
                var _g2 = this.length;
                while (_g11 < _g2) {
                    var i1 = _g11++;
                    var e = this[i1];
                    if (f1(e))
                        a1.push(e);
                }
                return a1;
            };
        var __map_reserved = {};
        var ArrayBuffer = $global.ArrayBuffer || js_html_compat_ArrayBuffer;
        if (ArrayBuffer.prototype.slice == null)
            ArrayBuffer.prototype.slice = js_html_compat_ArrayBuffer.sliceImpl;
        var DataView = $global.DataView || js_html_compat_DataView;
        var Uint8Array = $global.Uint8Array || js_html_compat_Uint8Array._new;
        // var global = window;
        (function (global, undefined) {
            "use strict";
            if (global.setImmediate) {
                return;
            }
            var nextHandle = 1; // Spec says greater than zero
            var tasksByHandle = {};
            var currentlyRunningATask = false;
            var doc = global.document;
            var setImmediate;
            function addFromSetImmediateArguments(args) {
                tasksByHandle[nextHandle] = partiallyApplied.apply(undefined, args);
                return nextHandle++;
            }
            // This function accepts the same arguments as setImmediate, but
            // returns a function that requires no arguments.
            function partiallyApplied(handler) {
                var args = [].slice.call(arguments, 1);
                return function () {
                    if (typeof handler === "function") {
                        handler.apply(undefined, args);
                    }
                    else {
                        (new Function("" + handler))();
                    }
                };
            }
            function runIfPresent(handle) {
                // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
                // So if we're currently running a task, we'll need to delay this invocation.
                if (currentlyRunningATask) {
                    // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
                    // "too much recursion" error.
                    setTimeout(partiallyApplied(runIfPresent, handle), 0);
                }
                else {
                    var task = tasksByHandle[handle];
                    if (task) {
                        currentlyRunningATask = true;
                        try {
                            task();
                        }
                        finally {
                            clearImmediate(handle);
                            currentlyRunningATask = false;
                        }
                    }
                }
            }
            function clearImmediate(handle) {
                delete tasksByHandle[handle];
            }
            function installNextTickImplementation() {
                setImmediate = function () {
                    var handle = addFromSetImmediateArguments(arguments);
                    process.nextTick(partiallyApplied(runIfPresent, handle));
                    return handle;
                };
            }
            function canUsePostMessage() {
                // The test against `importScripts` prevents this implementation from being installed inside a web worker,
                // where `global.postMessage` means something completely different and can't be used for this purpose.
                if (global.postMessage && !global.importScripts) {
                    var postMessageIsAsynchronous = true;
                    var oldOnMessage = global.onmessage;
                    global.onmessage = function () {
                        postMessageIsAsynchronous = false;
                    };
                    global.postMessage("", "*");
                    global.onmessage = oldOnMessage;
                    return postMessageIsAsynchronous;
                }
            }
            function installPostMessageImplementation() {
                // Installs an event handler on `global` for the `message` event: see
                // * https://developer.mozilla.org/en/DOM/window.postMessage
                // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages
                var messagePrefix = "setImmediate$" + Math.random() + "$";
                var onGlobalMessage = function (event) {
                    if (event.source === global &&
                        typeof event.data === "string" &&
                        event.data.indexOf(messagePrefix) === 0) {
                        runIfPresent(+event.data.slice(messagePrefix.length));
                    }
                };
                if (global.addEventListener) {
                    global.addEventListener("message", onGlobalMessage, false);
                }
                else {
                    global.attachEvent("onmessage", onGlobalMessage);
                }
                setImmediate = function () {
                    var handle = addFromSetImmediateArguments(arguments);
                    global.postMessage(messagePrefix + handle, "*");
                    return handle;
                };
            }
            function installMessageChannelImplementation() {
                var channel = new MessageChannel();
                channel.port1.onmessage = function (event) {
                    var handle = event.data;
                    runIfPresent(handle);
                };
                setImmediate = function () {
                    var handle = addFromSetImmediateArguments(arguments);
                    channel.port2.postMessage(handle);
                    return handle;
                };
            }
            function installReadyStateChangeImplementation() {
                var html = doc.documentElement;
                setImmediate = function () {
                    var handle = addFromSetImmediateArguments(arguments);
                    // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
                    // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
                    var script = doc.createElement("script");
                    script.onreadystatechange = function () {
                        runIfPresent(handle);
                        script.onreadystatechange = null;
                        html.removeChild(script);
                        script = null;
                    };
                    html.appendChild(script);
                    return handle;
                };
            }
            function installSetTimeoutImplementation() {
                setImmediate = function () {
                    var handle = addFromSetImmediateArguments(arguments);
                    setTimeout(partiallyApplied(runIfPresent, handle), 0);
                    return handle;
                };
            }
            // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
            var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
            attachTo = attachTo && attachTo.setTimeout ? attachTo : global;
            // Don't get fooled by e.g. browserify environments.
            if ({}.toString.call(global.process) === "[object process]") {
                // For Node.js before 0.9
                installNextTickImplementation();
            }
            else if (canUsePostMessage()) {
                // For non-IE10 modern browsers
                installPostMessageImplementation();
            }
            else if (global.MessageChannel) {
                // For web workers, where supported
                installMessageChannelImplementation();
            }
            else if (doc && "onreadystatechange" in doc.createElement("script")) {
                // For IE 6–8
                installReadyStateChangeImplementation();
            }
            else {
                // For older browsers
                installSetTimeoutImplementation();
            }
            attachTo.setImmediate = setImmediate;
            attachTo.clearImmediate = clearImmediate;
        }(new Function("return this")()));
        ;
        haxe_Serializer.USE_CACHE = false;
        haxe_Serializer.USE_ENUM_INDEX = false;
        haxe_Serializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
        haxe_Unserializer.DEFAULT_RESOLVER = Type;
        haxe_Unserializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
        haxe_ds_ObjectMap.count = 0;
        haxe_io_FPHelper.i64tmp = (function ($this) {
            var $r;
            var x = new haxe__$Int64__$_$_$Int64(0, 0);
            $r = x;
            return $r;
        }(this));
        js_Boot.__toStr = {}.toString;
        js_html_compat_Uint8Array.BYTES_PER_ELEMENT = 1;
        promhx_base_EventLoop.queue = new List();
        verb_core_Binomial.memo = new haxe_ds_IntMap();
        verb_core_Constants.TOLERANCE = 1e-6;
        verb_core_Constants.EPSILON = 1e-10;
        verb_core_Constants.VERSION = "2.0.0";
        verb_eval_Analyze.Tvalues = [[], [], [-0.5773502691896257645091487805019574556476, 0.5773502691896257645091487805019574556476], [0, -0.7745966692414833770358530799564799221665, 0.7745966692414833770358530799564799221665], [-0.3399810435848562648026657591032446872005, 0.3399810435848562648026657591032446872005, -0.8611363115940525752239464888928095050957, 0.8611363115940525752239464888928095050957], [0, -0.5384693101056830910363144207002088049672, 0.5384693101056830910363144207002088049672, -0.9061798459386639927976268782993929651256, 0.9061798459386639927976268782993929651256], [0.6612093864662645136613995950199053470064, -0.6612093864662645136613995950199053470064, -0.2386191860831969086305017216807119354186, 0.2386191860831969086305017216807119354186, -0.9324695142031520278123015544939946091347, 0.9324695142031520278123015544939946091347], [0, 0.4058451513773971669066064120769614633473, -0.4058451513773971669066064120769614633473, -0.7415311855993944398638647732807884070741, 0.7415311855993944398638647732807884070741, -0.9491079123427585245261896840478512624007, 0.9491079123427585245261896840478512624007], [-0.1834346424956498049394761423601839806667, 0.1834346424956498049394761423601839806667, -0.5255324099163289858177390491892463490419, 0.5255324099163289858177390491892463490419, -0.7966664774136267395915539364758304368371, 0.7966664774136267395915539364758304368371, -0.9602898564975362316835608685694729904282, 0.9602898564975362316835608685694729904282], [0, -0.8360311073266357942994297880697348765441, 0.8360311073266357942994297880697348765441, -0.9681602395076260898355762029036728700494, 0.9681602395076260898355762029036728700494, -0.3242534234038089290385380146433366085719, 0.3242534234038089290385380146433366085719, -0.6133714327005903973087020393414741847857, 0.6133714327005903973087020393414741847857], [-0.1488743389816312108848260011297199846175, 0.1488743389816312108848260011297199846175, -0.4333953941292471907992659431657841622000, 0.4333953941292471907992659431657841622000, -0.6794095682990244062343273651148735757692, 0.6794095682990244062343273651148735757692, -0.8650633666889845107320966884234930485275, 0.8650633666889845107320966884234930485275, -0.9739065285171717200779640120844520534282, 0.9739065285171717200779640120844520534282], [0, -0.2695431559523449723315319854008615246796, 0.2695431559523449723315319854008615246796, -0.5190961292068118159257256694586095544802, 0.5190961292068118159257256694586095544802, -0.7301520055740493240934162520311534580496, 0.7301520055740493240934162520311534580496, -0.8870625997680952990751577693039272666316, 0.8870625997680952990751577693039272666316, -0.9782286581460569928039380011228573907714, 0.9782286581460569928039380011228573907714], [-0.1252334085114689154724413694638531299833, 0.1252334085114689154724413694638531299833, -0.3678314989981801937526915366437175612563, 0.3678314989981801937526915366437175612563, -0.5873179542866174472967024189405342803690, 0.5873179542866174472967024189405342803690, -0.7699026741943046870368938332128180759849, 0.7699026741943046870368938332128180759849, -0.9041172563704748566784658661190961925375, 0.9041172563704748566784658661190961925375, -0.9815606342467192506905490901492808229601, 0.9815606342467192506905490901492808229601], [0, -0.2304583159551347940655281210979888352115, 0.2304583159551347940655281210979888352115, -0.4484927510364468528779128521276398678019, 0.4484927510364468528779128521276398678019, -0.6423493394403402206439846069955156500716, 0.6423493394403402206439846069955156500716, -0.8015780907333099127942064895828598903056, 0.8015780907333099127942064895828598903056, -0.9175983992229779652065478365007195123904, 0.9175983992229779652065478365007195123904, -0.9841830547185881494728294488071096110649, 0.9841830547185881494728294488071096110649], [-0.1080549487073436620662446502198347476119, 0.1080549487073436620662446502198347476119, -0.3191123689278897604356718241684754668342, 0.3191123689278897604356718241684754668342, -0.5152486363581540919652907185511886623088, 0.5152486363581540919652907185511886623088, -0.6872929048116854701480198030193341375384, 0.6872929048116854701480198030193341375384, -0.8272013150697649931897947426503949610397, 0.8272013150697649931897947426503949610397, -0.9284348836635735173363911393778742644770, 0.9284348836635735173363911393778742644770, -0.9862838086968123388415972667040528016760, 0.9862838086968123388415972667040528016760], [0, -0.2011940939974345223006283033945962078128, 0.2011940939974345223006283033945962078128, -0.3941513470775633698972073709810454683627, 0.3941513470775633698972073709810454683627, -0.5709721726085388475372267372539106412383, 0.5709721726085388475372267372539106412383, -0.7244177313601700474161860546139380096308, 0.7244177313601700474161860546139380096308, -0.8482065834104272162006483207742168513662, 0.8482065834104272162006483207742168513662, -0.9372733924007059043077589477102094712439, 0.9372733924007059043077589477102094712439, -0.9879925180204854284895657185866125811469, 0.9879925180204854284895657185866125811469], [-0.0950125098376374401853193354249580631303, 0.0950125098376374401853193354249580631303, -0.2816035507792589132304605014604961064860, 0.2816035507792589132304605014604961064860, -0.4580167776572273863424194429835775735400, 0.4580167776572273863424194429835775735400, -0.6178762444026437484466717640487910189918, 0.6178762444026437484466717640487910189918, -0.7554044083550030338951011948474422683538, 0.7554044083550030338951011948474422683538, -0.8656312023878317438804678977123931323873, 0.8656312023878317438804678977123931323873, -0.9445750230732325760779884155346083450911, 0.9445750230732325760779884155346083450911, -0.9894009349916499325961541734503326274262, 0.9894009349916499325961541734503326274262], [0, -0.1784841814958478558506774936540655574754, 0.1784841814958478558506774936540655574754, -0.3512317634538763152971855170953460050405, 0.3512317634538763152971855170953460050405, -0.5126905370864769678862465686295518745829, 0.5126905370864769678862465686295518745829, -0.6576711592166907658503022166430023351478, 0.6576711592166907658503022166430023351478, -0.7815140038968014069252300555204760502239, 0.7815140038968014069252300555204760502239, -0.8802391537269859021229556944881556926234, 0.8802391537269859021229556944881556926234, -0.9506755217687677612227169578958030214433, 0.9506755217687677612227169578958030214433, -0.9905754753144173356754340199406652765077, 0.9905754753144173356754340199406652765077], [-0.0847750130417353012422618529357838117333, 0.0847750130417353012422618529357838117333, -0.2518862256915055095889728548779112301628, 0.2518862256915055095889728548779112301628, -0.4117511614628426460359317938330516370789, 0.4117511614628426460359317938330516370789, -0.5597708310739475346078715485253291369276, 0.5597708310739475346078715485253291369276, -0.6916870430603532078748910812888483894522, 0.6916870430603532078748910812888483894522, -0.8037049589725231156824174550145907971032, 0.8037049589725231156824174550145907971032, -0.8926024664975557392060605911271455154078, 0.8926024664975557392060605911271455154078, -0.9558239495713977551811958929297763099728, 0.9558239495713977551811958929297763099728, -0.9915651684209309467300160047061507702525, 0.9915651684209309467300160047061507702525], [0, -0.1603586456402253758680961157407435495048, 0.1603586456402253758680961157407435495048, -0.3165640999636298319901173288498449178922, 0.3165640999636298319901173288498449178922, -0.4645707413759609457172671481041023679762, 0.4645707413759609457172671481041023679762, -0.6005453046616810234696381649462392798683, 0.6005453046616810234696381649462392798683, -0.7209661773352293786170958608237816296571, 0.7209661773352293786170958608237816296571, -0.8227146565371428249789224867127139017745, 0.8227146565371428249789224867127139017745, -0.9031559036148179016426609285323124878093, 0.9031559036148179016426609285323124878093, -0.9602081521348300308527788406876515266150, 0.9602081521348300308527788406876515266150, -0.9924068438435844031890176702532604935893, 0.9924068438435844031890176702532604935893], [-0.0765265211334973337546404093988382110047, 0.0765265211334973337546404093988382110047, -0.2277858511416450780804961953685746247430, 0.2277858511416450780804961953685746247430, -0.3737060887154195606725481770249272373957, 0.3737060887154195606725481770249272373957, -0.5108670019508270980043640509552509984254, 0.5108670019508270980043640509552509984254, -0.6360536807265150254528366962262859367433, 0.6360536807265150254528366962262859367433, -0.7463319064601507926143050703556415903107, 0.7463319064601507926143050703556415903107, -0.8391169718222188233945290617015206853296, 0.8391169718222188233945290617015206853296, -0.9122344282513259058677524412032981130491, 0.9122344282513259058677524412032981130491, -0.9639719272779137912676661311972772219120, 0.9639719272779137912676661311972772219120, -0.9931285991850949247861223884713202782226, 0.9931285991850949247861223884713202782226], [0, -0.1455618541608950909370309823386863301163, 0.1455618541608950909370309823386863301163, -0.2880213168024010966007925160646003199090, 0.2880213168024010966007925160646003199090, -0.4243421202074387835736688885437880520964, 0.4243421202074387835736688885437880520964, -0.5516188358872198070590187967243132866220, 0.5516188358872198070590187967243132866220, -0.6671388041974123193059666699903391625970, 0.6671388041974123193059666699903391625970, -0.7684399634756779086158778513062280348209, 0.7684399634756779086158778513062280348209, -0.8533633645833172836472506385875676702761, 0.8533633645833172836472506385875676702761, -0.9200993341504008287901871337149688941591, 0.9200993341504008287901871337149688941591, -0.9672268385663062943166222149076951614246, 0.9672268385663062943166222149076951614246, -0.9937521706203895002602420359379409291933, 0.9937521706203895002602420359379409291933], [-0.0697392733197222212138417961186280818222, 0.0697392733197222212138417961186280818222, -0.2078604266882212854788465339195457342156, 0.2078604266882212854788465339195457342156, -0.3419358208920842251581474204273796195591, 0.3419358208920842251581474204273796195591, -0.4693558379867570264063307109664063460953, 0.4693558379867570264063307109664063460953, -0.5876404035069115929588769276386473488776, 0.5876404035069115929588769276386473488776, -0.6944872631866827800506898357622567712673, 0.6944872631866827800506898357622567712673, -0.7878168059792081620042779554083515213881, 0.7878168059792081620042779554083515213881, -0.8658125777203001365364256370193787290847, 0.8658125777203001365364256370193787290847, -0.9269567721871740005206929392590531966353, 0.9269567721871740005206929392590531966353, -0.9700604978354287271239509867652687108059, 0.9700604978354287271239509867652687108059, -0.9942945854823992920730314211612989803930, 0.9942945854823992920730314211612989803930], [0, -0.1332568242984661109317426822417661370104, 0.1332568242984661109317426822417661370104, -0.2641356809703449305338695382833096029790, 0.2641356809703449305338695382833096029790, -0.3903010380302908314214888728806054585780, 0.3903010380302908314214888728806054585780, -0.5095014778460075496897930478668464305448, 0.5095014778460075496897930478668464305448, -0.6196098757636461563850973116495956533871, 0.6196098757636461563850973116495956533871, -0.7186613631319501944616244837486188483299, 0.7186613631319501944616244837486188483299, -0.8048884016188398921511184069967785579414, 0.8048884016188398921511184069967785579414, -0.8767523582704416673781568859341456716389, 0.8767523582704416673781568859341456716389, -0.9329710868260161023491969890384229782357, 0.9329710868260161023491969890384229782357, -0.9725424712181152319560240768207773751816, 0.9725424712181152319560240768207773751816, -0.9947693349975521235239257154455743605736, 0.9947693349975521235239257154455743605736], [-0.0640568928626056260850430826247450385909, 0.0640568928626056260850430826247450385909, -0.1911188674736163091586398207570696318404, 0.1911188674736163091586398207570696318404, -0.3150426796961633743867932913198102407864, 0.3150426796961633743867932913198102407864, -0.4337935076260451384870842319133497124524, 0.4337935076260451384870842319133497124524, -0.5454214713888395356583756172183723700107, 0.5454214713888395356583756172183723700107, -0.6480936519369755692524957869107476266696, 0.6480936519369755692524957869107476266696, -0.7401241915785543642438281030999784255232, 0.7401241915785543642438281030999784255232, -0.8200019859739029219539498726697452080761, 0.8200019859739029219539498726697452080761, -0.8864155270044010342131543419821967550873, 0.8864155270044010342131543419821967550873, -0.9382745520027327585236490017087214496548, 0.9382745520027327585236490017087214496548, -0.9747285559713094981983919930081690617411, 0.9747285559713094981983919930081690617411, -0.9951872199970213601799974097007368118745, 0.9951872199970213601799974097007368118745]];
        verb_eval_Analyze.Cvalues = [[], [], [1.0, 1.0], [0.8888888888888888888888888888888888888888, 0.5555555555555555555555555555555555555555, 0.5555555555555555555555555555555555555555], [0.6521451548625461426269360507780005927646, 0.6521451548625461426269360507780005927646, 0.3478548451374538573730639492219994072353, 0.3478548451374538573730639492219994072353], [0.5688888888888888888888888888888888888888, 0.4786286704993664680412915148356381929122, 0.4786286704993664680412915148356381929122, 0.2369268850561890875142640407199173626432, 0.2369268850561890875142640407199173626432], [0.3607615730481386075698335138377161116615, 0.3607615730481386075698335138377161116615, 0.4679139345726910473898703439895509948116, 0.4679139345726910473898703439895509948116, 0.1713244923791703450402961421727328935268, 0.1713244923791703450402961421727328935268], [0.4179591836734693877551020408163265306122, 0.3818300505051189449503697754889751338783, 0.3818300505051189449503697754889751338783, 0.2797053914892766679014677714237795824869, 0.2797053914892766679014677714237795824869, 0.1294849661688696932706114326790820183285, 0.1294849661688696932706114326790820183285], [0.3626837833783619829651504492771956121941, 0.3626837833783619829651504492771956121941, 0.3137066458778872873379622019866013132603, 0.3137066458778872873379622019866013132603, 0.2223810344533744705443559944262408844301, 0.2223810344533744705443559944262408844301, 0.1012285362903762591525313543099621901153, 0.1012285362903762591525313543099621901153], [0.3302393550012597631645250692869740488788, 0.1806481606948574040584720312429128095143, 0.1806481606948574040584720312429128095143, 0.0812743883615744119718921581105236506756, 0.0812743883615744119718921581105236506756, 0.3123470770400028400686304065844436655987, 0.3123470770400028400686304065844436655987, 0.2606106964029354623187428694186328497718, 0.2606106964029354623187428694186328497718], [0.2955242247147528701738929946513383294210, 0.2955242247147528701738929946513383294210, 0.2692667193099963550912269215694693528597, 0.2692667193099963550912269215694693528597, 0.2190863625159820439955349342281631924587, 0.2190863625159820439955349342281631924587, 0.1494513491505805931457763396576973324025, 0.1494513491505805931457763396576973324025, 0.0666713443086881375935688098933317928578, 0.0666713443086881375935688098933317928578], [0.2729250867779006307144835283363421891560, 0.2628045445102466621806888698905091953727, 0.2628045445102466621806888698905091953727, 0.2331937645919904799185237048431751394317, 0.2331937645919904799185237048431751394317, 0.1862902109277342514260976414316558916912, 0.1862902109277342514260976414316558916912, 0.1255803694649046246346942992239401001976, 0.1255803694649046246346942992239401001976, 0.0556685671161736664827537204425485787285, 0.0556685671161736664827537204425485787285], [0.2491470458134027850005624360429512108304, 0.2491470458134027850005624360429512108304, 0.2334925365383548087608498989248780562594, 0.2334925365383548087608498989248780562594, 0.2031674267230659217490644558097983765065, 0.2031674267230659217490644558097983765065, 0.1600783285433462263346525295433590718720, 0.1600783285433462263346525295433590718720, 0.1069393259953184309602547181939962242145, 0.1069393259953184309602547181939962242145, 0.0471753363865118271946159614850170603170, 0.0471753363865118271946159614850170603170], [0.2325515532308739101945895152688359481566, 0.2262831802628972384120901860397766184347, 0.2262831802628972384120901860397766184347, 0.2078160475368885023125232193060527633865, 0.2078160475368885023125232193060527633865, 0.1781459807619457382800466919960979955128, 0.1781459807619457382800466919960979955128, 0.1388735102197872384636017768688714676218, 0.1388735102197872384636017768688714676218, 0.0921214998377284479144217759537971209236, 0.0921214998377284479144217759537971209236, 0.0404840047653158795200215922009860600419, 0.0404840047653158795200215922009860600419], [0.2152638534631577901958764433162600352749, 0.2152638534631577901958764433162600352749, 0.2051984637212956039659240656612180557103, 0.2051984637212956039659240656612180557103, 0.1855383974779378137417165901251570362489, 0.1855383974779378137417165901251570362489, 0.1572031671581935345696019386238421566056, 0.1572031671581935345696019386238421566056, 0.1215185706879031846894148090724766259566, 0.1215185706879031846894148090724766259566, 0.0801580871597602098056332770628543095836, 0.0801580871597602098056332770628543095836, 0.0351194603317518630318328761381917806197, 0.0351194603317518630318328761381917806197], [0.2025782419255612728806201999675193148386, 0.1984314853271115764561183264438393248186, 0.1984314853271115764561183264438393248186, 0.1861610000155622110268005618664228245062, 0.1861610000155622110268005618664228245062, 0.1662692058169939335532008604812088111309, 0.1662692058169939335532008604812088111309, 0.1395706779261543144478047945110283225208, 0.1395706779261543144478047945110283225208, 0.1071592204671719350118695466858693034155, 0.1071592204671719350118695466858693034155, 0.0703660474881081247092674164506673384667, 0.0703660474881081247092674164506673384667, 0.0307532419961172683546283935772044177217, 0.0307532419961172683546283935772044177217], [0.1894506104550684962853967232082831051469, 0.1894506104550684962853967232082831051469, 0.1826034150449235888667636679692199393835, 0.1826034150449235888667636679692199393835, 0.1691565193950025381893120790303599622116, 0.1691565193950025381893120790303599622116, 0.1495959888165767320815017305474785489704, 0.1495959888165767320815017305474785489704, 0.1246289712555338720524762821920164201448, 0.1246289712555338720524762821920164201448, 0.0951585116824927848099251076022462263552, 0.0951585116824927848099251076022462263552, 0.0622535239386478928628438369943776942749, 0.0622535239386478928628438369943776942749, 0.0271524594117540948517805724560181035122, 0.0271524594117540948517805724560181035122], [0.1794464703562065254582656442618856214487, 0.1765627053669926463252709901131972391509, 0.1765627053669926463252709901131972391509, 0.1680041021564500445099706637883231550211, 0.1680041021564500445099706637883231550211, 0.1540457610768102880814315948019586119404, 0.1540457610768102880814315948019586119404, 0.1351363684685254732863199817023501973721, 0.1351363684685254732863199817023501973721, 0.1118838471934039710947883856263559267358, 0.1118838471934039710947883856263559267358, 0.0850361483171791808835353701910620738504, 0.0850361483171791808835353701910620738504, 0.0554595293739872011294401653582446605128, 0.0554595293739872011294401653582446605128, 0.0241483028685479319601100262875653246916, 0.0241483028685479319601100262875653246916], [0.1691423829631435918406564701349866103341, 0.1691423829631435918406564701349866103341, 0.1642764837458327229860537764659275904123, 0.1642764837458327229860537764659275904123, 0.1546846751262652449254180038363747721932, 0.1546846751262652449254180038363747721932, 0.1406429146706506512047313037519472280955, 0.1406429146706506512047313037519472280955, 0.1225552067114784601845191268002015552281, 0.1225552067114784601845191268002015552281, 0.1009420441062871655628139849248346070628, 0.1009420441062871655628139849248346070628, 0.0764257302548890565291296776166365256053, 0.0764257302548890565291296776166365256053, 0.0497145488949697964533349462026386416808, 0.0497145488949697964533349462026386416808, 0.0216160135264833103133427102664524693876, 0.0216160135264833103133427102664524693876], [0.1610544498487836959791636253209167350399, 0.1589688433939543476499564394650472016787, 0.1589688433939543476499564394650472016787, 0.1527660420658596667788554008976629984610, 0.1527660420658596667788554008976629984610, 0.1426067021736066117757461094419029724756, 0.1426067021736066117757461094419029724756, 0.1287539625393362276755157848568771170558, 0.1287539625393362276755157848568771170558, 0.1115666455473339947160239016817659974813, 0.1115666455473339947160239016817659974813, 0.0914900216224499994644620941238396526609, 0.0914900216224499994644620941238396526609, 0.0690445427376412265807082580060130449618, 0.0690445427376412265807082580060130449618, 0.0448142267656996003328381574019942119517, 0.0448142267656996003328381574019942119517, 0.0194617882297264770363120414644384357529, 0.0194617882297264770363120414644384357529], [0.1527533871307258506980843319550975934919, 0.1527533871307258506980843319550975934919, 0.1491729864726037467878287370019694366926, 0.1491729864726037467878287370019694366926, 0.1420961093183820513292983250671649330345, 0.1420961093183820513292983250671649330345, 0.1316886384491766268984944997481631349161, 0.1316886384491766268984944997481631349161, 0.1181945319615184173123773777113822870050, 0.1181945319615184173123773777113822870050, 0.1019301198172404350367501354803498761666, 0.1019301198172404350367501354803498761666, 0.0832767415767047487247581432220462061001, 0.0832767415767047487247581432220462061001, 0.0626720483341090635695065351870416063516, 0.0626720483341090635695065351870416063516, 0.0406014298003869413310399522749321098790, 0.0406014298003869413310399522749321098790, 0.0176140071391521183118619623518528163621, 0.0176140071391521183118619623518528163621], [0.1460811336496904271919851476833711882448, 0.1445244039899700590638271665537525436099, 0.1445244039899700590638271665537525436099, 0.1398873947910731547221334238675831108927, 0.1398873947910731547221334238675831108927, 0.1322689386333374617810525744967756043290, 0.1322689386333374617810525744967756043290, 0.1218314160537285341953671771257335983563, 0.1218314160537285341953671771257335983563, 0.1087972991671483776634745780701056420336, 0.1087972991671483776634745780701056420336, 0.0934444234560338615532897411139320884835, 0.0934444234560338615532897411139320884835, 0.0761001136283793020170516533001831792261, 0.0761001136283793020170516533001831792261, 0.0571344254268572082836358264724479574912, 0.0571344254268572082836358264724479574912, 0.0369537897708524937999506682993296661889, 0.0369537897708524937999506682993296661889, 0.0160172282577743333242246168584710152658, 0.0160172282577743333242246168584710152658], [0.1392518728556319933754102483418099578739, 0.1392518728556319933754102483418099578739, 0.1365414983460151713525738312315173965863, 0.1365414983460151713525738312315173965863, 0.1311735047870623707329649925303074458757, 0.1311735047870623707329649925303074458757, 0.1232523768105124242855609861548144719594, 0.1232523768105124242855609861548144719594, 0.1129322960805392183934006074217843191142, 0.1129322960805392183934006074217843191142, 0.1004141444428809649320788378305362823508, 0.1004141444428809649320788378305362823508, 0.0859416062170677274144436813727028661891, 0.0859416062170677274144436813727028661891, 0.0697964684245204880949614189302176573987, 0.0697964684245204880949614189302176573987, 0.0522933351526832859403120512732112561121, 0.0522933351526832859403120512732112561121, 0.0337749015848141547933022468659129013491, 0.0337749015848141547933022468659129013491, 0.0146279952982722006849910980471854451902, 0.0146279952982722006849910980471854451902], [0.1336545721861061753514571105458443385831, 0.1324620394046966173716424647033169258050, 0.1324620394046966173716424647033169258050, 0.1289057221880821499785953393997936532597, 0.1289057221880821499785953393997936532597, 0.1230490843067295304675784006720096548158, 0.1230490843067295304675784006720096548158, 0.1149966402224113649416435129339613014914, 0.1149966402224113649416435129339613014914, 0.1048920914645414100740861850147438548584, 0.1048920914645414100740861850147438548584, 0.0929157660600351474770186173697646486034, 0.0929157660600351474770186173697646486034, 0.0792814117767189549228925247420432269137, 0.0792814117767189549228925247420432269137, 0.0642324214085258521271696151589109980391, 0.0642324214085258521271696151589109980391, 0.0480376717310846685716410716320339965612, 0.0480376717310846685716410716320339965612, 0.0309880058569794443106942196418845053837, 0.0309880058569794443106942196418845053837, 0.0134118594871417720813094934586150649766, 0.0134118594871417720813094934586150649766], [0.1279381953467521569740561652246953718517, 0.1279381953467521569740561652246953718517, 0.1258374563468282961213753825111836887264, 0.1258374563468282961213753825111836887264, 0.1216704729278033912044631534762624256070, 0.1216704729278033912044631534762624256070, 0.1155056680537256013533444839067835598622, 0.1155056680537256013533444839067835598622, 0.1074442701159656347825773424466062227946, 0.1074442701159656347825773424466062227946, 0.0976186521041138882698806644642471544279, 0.0976186521041138882698806644642471544279, 0.0861901615319532759171852029837426671850, 0.0861901615319532759171852029837426671850, 0.0733464814110803057340336152531165181193, 0.0733464814110803057340336152531165181193, 0.0592985849154367807463677585001085845412, 0.0592985849154367807463677585001085845412, 0.0442774388174198061686027482113382288593, 0.0442774388174198061686027482113382288593, 0.0285313886289336631813078159518782864491, 0.0285313886289336631813078159518782864491, 0.0123412297999871995468056670700372915759, 0.0123412297999871995468056670700372915759]];
        verb_exe_Dispatcher.THREADS = 1;
        verb_exe_Dispatcher._init = false;
        verb_exe_WorkerPool.basePath = "";
        verb_exe__$WorkerPool_Work.uuid = 0;
        verb_Verb.main();
    })(typeof console != "undefined" ? console : { log: function () { } }, verb, typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
    return verb;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVyYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYnMvdmVyYi92ZXJiLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGlDQUFpQztBQUNqQyxvR0FBb0c7QUFFcEcsQ0FBQyxVQUFTLENBQUM7SUFDUCxJQUFHLE9BQU8sT0FBTyxLQUFHLFFBQVEsSUFBRSxPQUFPLE1BQU0sS0FBRyxXQUFXLEVBQUM7UUFDdEQsTUFBTSxDQUFDLE9BQU8sR0FBQyxDQUFDLEVBQUUsQ0FBQTtLQUNyQjtTQUFNLElBQUcsT0FBTyxNQUFNLEtBQUcsVUFBVSxJQUFFLE1BQU0sQ0FBQyxHQUFHLEVBQUM7UUFDN0MsTUFBTSxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQTtLQUNmO1NBQU07UUFDSCxJQUFJLENBQUMsQ0FBQztRQUNOLElBQUcsT0FBTyxNQUFNLEtBQUcsV0FBVyxFQUFDO1lBQzNCLENBQUMsR0FBQyxNQUFNLENBQUE7U0FDWDthQUFNLElBQUcsT0FBTyxNQUFNLEtBQUcsV0FBVyxFQUFDO1lBQ2xDLENBQUMsR0FBQyxNQUFNLENBQUE7U0FDWDthQUFNLElBQUcsT0FBTyxJQUFJLEtBQUcsV0FBVyxFQUFDO1lBQ2hDLENBQUMsR0FBQyxJQUFJLENBQUE7U0FDVDthQUFLO1lBQ0YsQ0FBQyxHQUFDLElBQUksQ0FBQTtTQUNUO1FBRUQsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQTtLQUNmO0FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDQyxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7SUFFZCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7SUFFbEIsSUFBSSxTQUFTLEdBQUcsSUFBSSxRQUFRLENBQUMscURBQXFELENBQUMsQ0FBQztJQUN2RixpRkFBaUY7SUFDakYsNEdBQTRHO0lBRXpHLHdDQUF3QztJQUN4QyxxQ0FBcUM7SUFDckMsb0RBQW9EO0lBQ3BELElBQUk7SUFFSixrQ0FBa0M7SUFDbEMsb0NBQW9D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QUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dDQUNsQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dDQUNuRCxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dDQUNuRCxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7cUNBQ2xDO29DQUNELElBQUcsRUFBRSxJQUFJLEdBQUcsRUFBRTt3Q0FDYixJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7d0NBQ3ZCLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQzt3Q0FDdkIsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dDQUNuQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dDQUNyRCxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO3FDQUN4Qzt5Q0FBTSxJQUFHLEVBQUUsSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFO3dDQUN4QixJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7d0NBQ3ZCLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt3Q0FDbkMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztxQ0FDeEM7b0NBQ0QsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztvQ0FDdkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDO29DQUNsQixJQUFHLEtBQUssQ0FBQyxNQUFNLElBQUksSUFBSTt3Q0FBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUM7O3dDQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO29DQUNwRixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUM7b0NBQ2xCLElBQUcsS0FBSyxJQUFJLElBQUk7d0NBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDOzt3Q0FBTSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDO29DQUN0RSxNQUFNO2dDQUNQO29DQUNDLElBQUcsSUFBSSxDQUFDLFFBQVE7d0NBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQ0FDbkMsSUFBRyxDQUFDLENBQUMsV0FBVyxJQUFJLElBQUksRUFBRTt3Q0FDekIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDO3dDQUNsQixJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3Q0FDM0MsSUFBRyxJQUFJLENBQUMsUUFBUTs0Q0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FB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QU8sRUFBRSxDQUFDO29CQUNYLEtBQUssR0FBRzt3QkFDUCxJQUFJLENBQUMsQ0FBQzt3QkFDTixJQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTs0QkFDM1gsSUFBSSxFQUFFLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFDLElBQUksQ0FBQyxHQUFHLEVBQUMsRUFBRSxDQUFDLENBQUM7NEJBQ2xELENBQUMsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDOzRCQUM1QixJQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQzt5QkFDZjs2QkFBTTs0QkFDTixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7NEJBQ3pCLElBQUksRUFBRSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7NEJBQ3BCLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ2QsQ0FBQyxHQUFHLEVBQUUsQ0FBQzt5QkFDUDt3QkFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDbkIsT0FBTyxDQUFDLENBQUM7b0JBQ1YsS0FBSyxHQUFHO3dCQUNQLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQzt3QkFDN0IsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQzt3QkFDcEIsSUFBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSTs0QkFBRSxNQUFNLElBQUksbUJBQW1CLENBQUMsc0JBQXNCLENBQUMsQ0FBQzt3QkFDdEgsSUFBSSxLQUFLLEdBQUcsaUJBQWlCLENBQUMsS0FBSyxDQUFDO3dCQUNwQyxJQUFHLEtBQUssSUFBSSxJQUFJLEVBQUU7NEJBQ2pCLEtBQUssR0FBRyxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsQ0FBQzs0QkFDdEMsaUJBQWlCLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzt5QkFDaEM7d0JBQ0QsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQzt3QkFDbEIsSUFBSSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQzt3QkFDcEIsSUFBSSxJQUFJLENBQUM7d0JBQ1QsSUFBSSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUEsQ0FBQyxDQUFBLElBQUksR0FBRyxDQUFDLENBQUEsQ0FBQyxDQUFBLENBQUMsQ0FBQyxDQUFDO3dCQUNoRCxJQUFJLEdBQUcsR0FBRyxFQUFFLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUM7d0JBQzdCLElBQUksS0FBSyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ3RDLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQzt3QkFDYixPQUFNLEVBQUUsR0FBRyxHQUFHLEVBQUU7NEJBQ2YsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFDbkQsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFDbEQsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQzs0QkFDckMsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFDbEQsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQzs0QkFDcEMsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFDbEQsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO3lCQUMvQjt3QkFDRCxJQUFHLElBQUksSUFBSSxDQUFDLEVBQUU7NEJBQ2IsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFD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QUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0IsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQUksRUFBRSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLElBQUksRUFBRSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLElBQUksRUFBRSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLElBQUksQ0FBQyxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQyxFQUFFLENBQUMsRUFBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkcsSUFBSSxFQUFFLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM1RCxJQUFJLEVBQUUsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzVELElBQUksRUFBRSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxD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d0JBQzFCLENBQUMsSUFBSSxFQUFFLENBQUM7d0JBQ1IsU0FBUztxQkFDVDtvQkFDRCxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQzVCLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNmLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ1gsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ2YsRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDbkIsRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDbkIsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQzVILE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxJQUFJ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QUFDLE1BQU0sQ0FBQztZQUNuQixPQUFNLEdBQUcsR0FBRyxHQUFHLEVBQUU7Z0JBQ2hCLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO2dCQUNkLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2xCO1lBQ0QsT0FBTyxFQUFFLENBQUM7UUFDWCxDQUFDLENBQUM7UUFDRixhQUFhLENBQUMsR0FBRyxHQUFHLFVBQVMsQ0FBQyxFQUFDLENBQUM7WUFDL0IsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDO1lBQ1osSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQ1osSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztZQUNuQixPQUFNLEdBQUcsR0FBRyxHQUFHLEVBQUU7Z0JBQ2hCLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO2dCQUNkLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQ2xCO1lBQ0QsT0FBTyxFQUFFLENBQUM7UUFDWCxDQUFDLENBQUM7UUFDRixhQUFhLENBQUMsR0FBRyxHQUFHLFVBQVMsQ0FBQyxFQUFDLENBQUM7WUFDL0IsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDO1lBQ1osSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQ1osSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztZQUNuQixPQUFNLEdBQUcsR0FBRyxHQUFHLEVBQUU7Z0JBQ2hCLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO2dCQUNkLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3JCO1lBQ0QsT0FBTyxFQUFFLENBQUM7UUFDWCxDQUFDLENBQUM7UUFDRixhQUFhLENBQUMsTUFBTSxHQUFHLFVBQVMsR0FBRztZQUNsQyxJQUFJLEdBQUcsR0FB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LEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0RSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0QsSUFBSSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9HLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN4QyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7WUFDaEIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2hCLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNYLE9BQU0sRUFBRSxHQUFHLENBQUMsRUFBRTtnQkFDYixJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQztnQkFDYixJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2QsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNkLElBQUksR0FBRyxHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM3RCxJQUFHLEdBQUcsSUFBSSxJQUFJO29CQUFFLFNBQVM7Z0JBQ3pCLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQ2xCLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQ2xCLElBQUcsSUFBSSxHQUFHLENBQUMsbUJBQW1CLENBQUMsT0FBTyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsbUJBQW1CLENBQUMsT0FBTztvQkFBRSxTQUFTO2dCQUM5RixJQUFHLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO29CQUFFLElBQUksR0FBRyxJQUFJLHVCQUF1QixDQUFDLElBQUksRUFBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUMsR0FBRyxDQUFDLEdBQUcsRUFBQyxJQUFJLENBQUMsRUFBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZLLElBQUcsSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUM7b0JBQUUsSUFBSSxHQUFHLElBQUksdUJBQXVCLENBQUMsSUFBSSxFQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBQyxHQUFHLENBQUMsR0FBRyxFQUFDLElBQUksQ0FBQyxFQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN2SztZQUNELElBQUcsSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSTtnQkFBRSxPQUFPLElBQUksQ0FBQztZQUM3QyxPQUFPLElBQUksa0JBQWtCLENBQUMsSUFBSSxFQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFDLENBQUMsQ0FBQztRQUNGLG1CQUFtQixDQUFDLDBCQUEwQixHQUFHLFVBQVMsS0FBSyxFQUFDLEtBQUssRUFBQyxLQUFLLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxVQUFVO1lBQ3RHLElBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsbUJBQW1CLENBQUMsT0FBTyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLG1CQUFtQixDQUFDLE9BQU87Z0JBQUUsT0FBTyxJQUFJLENBQUM7WUFDbkksSUFBSSxHQUFHLENBQUM7WUFDUixJQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFBRSxHQUFHLEdBQUcsSUFBSSxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQzs7Z0JBQU0sR0FBRyxHQUFHLElBQUksY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEgsSUFBSSxHQUFHLENBQUM7WUFDUixJQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFBRSxHQUFHLEdBQUcsSUFBSSxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQzs7Z0JBQU0sR0FBRyxHQUFHLElBQUksY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEgsSUFBSSxHQUFHLEdBQUcsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLCtCQUErQixDQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUMsVUFBVSxFQUFDLFVBQVUsQ0FBQyxFQUFDLElBQUksK0JBQStCLENBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBQyxVQUFVLEVBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUM1TSxJQUFHLEdBQUcsQ0FBQyxLQUFLLElBQUksQ0FBQyxFQUFFO2dCQUNsQixHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztnQkFDM0IsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsY0FBYyxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBQyxVQUFVLEVBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNuRjtpQkFBTTtnQkFDTixHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxjQUFjLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFDLFVBQVUsRUFBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNuRixHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQzthQUMzQjtZQUNELElBQUcsR0FBRyxDQUFDLEtBQUssSUFBSSxDQUFDLEVBQUU7Z0JBQ2xCLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO2dCQUMzQixHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxjQUFjLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFDLFVBQVUsRUFBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ25GO2lCQUFNO2dCQUNOLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUMsVUFBVSxFQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ25GLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO2FBQzNCO1lBQ0QsT0FBTyxHQUFHLENBQUM7UUFDWixDQUFDLENBQUM7UUFDRixtQkFBbUIsQ0FBQyxNQUFNLEdBQUcsVUFBUyxPQUFPLEVBQUMsT0FBTyxFQUFDLE9BQU8sRUFBQyxPQUFPO1lBQ3BFLElBQUksQ0FBQyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzdDLElBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEdBQUcsbUJBQW1CLENBQUMsT0FBTztnQkFBRSxPQUFPLElBQUksQ0FBQztZQUNyRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDWCxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QixJQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7Z0JBQ1gsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDUCxFQUFFLEdBQUcsRUFBRSxDQUFDO2FBQ1I7WUFDRCxJQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7Z0JBQ1gsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDUCxFQUFFLEdBQUcsRUFBRSxDQUFDO2FBQ1I7WUFDRCxJQUFJLEVBQUUsQ0FBQztZQUNQLElBQUksRUFBRSxDQUFDO1lBQ1AsSUFBSSxFQUFFLENBQUM7WUFDUCxJQUFJLEVBQUUsQ0FBQztZQUNQLElBQUcsRUFBRSxJQUFJLENBQUMsRUFBRTtnQkFDWCxFQUFFLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoQixFQUFFLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoQixFQUFFLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoQixFQUFFLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2hCO2lCQUFNLElBQUcsRUFBRSxJQUFJLENBQUMsRUFBRTtnQkFDbEIsRUFBRSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEIsRUFBRSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEIsRUFBRSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEIsRUFBRSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNoQjtpQkFBTTtnQkFDTixFQUFFLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoQixFQUFFLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoQixFQUFFLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoQixFQUFFLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2hCO1lBQ0QsSUFBSSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBQyxPQUFPLENBQUMsQ0FBQztZQUM3QyxJQUFJLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzdDLElBQUksR0FBRyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztZQUM1QixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUNsQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUNsQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUcsRUFBRSxJQUFJLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztpQkFBTSxJQUFHLEVBQUUsSUFBSSxDQUFDO2dCQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7O2dCQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEUsT0FBTyxJQUFJLGFBQWEsQ0FBQyxDQUFDLEVBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pELENBQUMsQ0FBQztRQUNGLG1CQUFtQixDQUFDLFdBQVcsR0FBRyxVQUFTLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRTtZQUMzRCxJQUFJLENBQUMsR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBQyxFQUFFLENBQUMsQ0FBQztZQUNuQyxJQUFJLEdBQUcsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQztZQUNsQyxJQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsbUJBQW1CLENBQUMsT0FBTztnQkFBRSxPQUFPLElBQUksQ0FBQztZQUM1RCxJQUFJLElBQUksR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQyxFQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDaEYsSUFBSSxHQUFHLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsRUFBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2xGLE9BQU8sYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQztRQUNGLG1CQUFtQixDQUFDLFNBQVMsR0FBRyxVQUFTLFNBQVMsRUFBQyxTQUFTLEVBQUMsR0FBRztZQUMvRCxJQUFJLEdBQUcsR0FBRyxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLHFDQUFxQyxDQUFDLFNBQVMsQ0FBQyxFQUFDLElBQUkscUNBQXFDLENBQUMsU0FBUyxDQUFDLEVBQUMsR0FBRyxDQUFDLENBQUM7WUFDOUosSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDO1lBQ3RCLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNYLE9BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUU7Z0JBQ3RCLElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDcEIsRUFBRSxFQUFFLENBQUM7Z0JBQ0wsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztnQkFDekIsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztnQkFDekIsSUFBSSxLQUFLLEdBQUcsbUJBQW1CLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsRUFBQyxHQUFHLENBQUMsQ0FBQztnQkFDMUosSUFBRyxLQUFLLElBQUksSUFBSTtvQkFBRSxTQUFTO2dCQUMzQixLQUFLLENBQUMsRUFBRSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckcsS0FBSyxDQUFDLEVBQUUsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JHLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDekI7WUFDRCxPQUFPLFlBQVksQ0FBQztRQUNyQixDQUFDLENBQUM7UUFDRixtQkFBbUIsQ0FBQyxRQUFRLEdBQUcsVUFBUyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsR0FBRztZQUN0RCxJQUFJLEtBQUssR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQyxFQUFFLENBQUMsQ0FBQztZQUNyQyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDbkQsSUFBSSxDQUFDLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hDLElBQUksS0FBSyxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3JDLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNuRCxJQUFJLENBQUMsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUMsS0FBSyxDQUFDLENBQUM7WUFDeEMsSUFBSSxVQUFVLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBQyxDQUFDLEVBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JELElBQUcsVUFBVSxJQUFJLElBQUksRUFBRTtnQkFDdEIsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQyxVQUFVLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN0RCxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLFVBQVUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3RELElBQUksTUFBTSxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBQyxFQUFFLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxNQUFNLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUM5QyxJQUFJLElBQUksR0FBRyxhQUFhLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBQyxNQUFNLENBQUMsQ0FBQztnQkFDcEQsSUFBRyxJQUFJLEdBQUcsR0FBRyxHQUFHLEdBQUc7b0JBQUUsT0FBTyxJQUFJLGdDQUFnQyxDQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQ3RGO1lBQ0QsT0FBTyxJQUFJLENBQUM7UUFDYixDQUFDLENBQUM7UUFDRixtQkFBbUIsQ0FBQyxJQUFJLEdBQUcsVUFBUyxFQUFFLEVBQUMsQ0FBQyxFQUFDLEVBQUUsRUFBQyxDQUFDO1lBQzVDLElBQUksR0FBRyxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLElBQUksSUFBSSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ25DLElBQUksSUFBSSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ25DLElBQUksSUFBSSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ25DLElBQUksSUFBSSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ25DLElBQUksR0FBRyxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLElBQUksR0FBRyxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLElBQUksR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztZQUNoQyxJQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsbUJBQW1CLENBQUMsT0FBTztnQkFBRSxPQUFPLElBQUksQ0FBQztZQUM1RCxJQUFJLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO1lBQ3BELElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7WUFDbEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7WUFDdEMsSUFBSSxFQUFFLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLElBQUksRUFBRSxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztZQUNyQyxPQUFPLElBQUksZ0NBQWdDLENBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEQsQ0FBQyxDQUFDO1FBQ0YsbUJBQW1CLENBQUMsbUJBQW1CLEdBQUcsVUFBUyxFQUFFLEVBQUMsRUFBRSxFQUFDLE1BQU0sRUFBQyxHQUFHO1lBQ2xFLElBQUksRUFBRSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QixJQUFJLEVBQUUsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsSUFBSSxFQUFFLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2pDLElBQUksQ0FBQyxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2pDLElBQUksQ0FBQyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLElBQUksR0FBRyxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ25DLElBQUksRUFBRSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsRUFBRSxDQUFDLENBQUM7WUFDakMsSUFBSSxDQUFDLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsR0FBRyxDQUFDLENBQUM7WUFDakMsSUFBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLG1CQUFtQixDQUFDLE9BQU87Z0JBQUUsT0FBTyxJQUFJLENBQUM7WUFDMUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNkLElBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztnQkFBRSxPQUFPLElBQUksQ0FBQztZQUMvQixJQUFJLEVBQUUsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3hELElBQUksRUFBRSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLElBQUksRUFBRSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLElBQUksRUFBRSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2pDLElBQUksRUFBRSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLElBQUksRUFBRSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLElBQUksS0FBSyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztZQUM5QixJQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsbUJBQW1CLENBQUMsT0FBTztnQkFBRSxPQUFPLElBQUksQ0FBQztZQUM5RCxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUNwQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUNwQyxJQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsbUJBQW1CLENBQUMsT0FBTyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsbUJBQW1CLENBQUMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsbUJBQW1CLENBQUMsT0FBTztnQkFBRSxPQUFPLElBQUksQ0FBQztZQUNwTixPQUFPLElBQUksZ0NBQWdDLENBQUMsRUFBRSxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkQsQ0FBQyxDQUFDO1FBQ0YsbUJBQW1CLENBQUMsZUFBZSxHQUFHLFVBQVMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsQ0FBQztZQUN4RCxJQUFJLEtBQUssR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzFELElBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxtQkFBbUIsQ0FBQyxPQUFPO2dCQUFFLE9BQU8sSUFBSSxDQUFDO1lBQzlELElBQUksS0FBSyxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDMUQsSUFBSSxDQUFDLEdBQUcsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUN0QixJQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsbUJBQW1CLENBQUMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLE9BQU87Z0JBQUUsT0FBTyxJQUFJLENBQUM7WUFDMUYsT0FBTyxFQUFFLENBQUMsRUFBRyxDQUFDLEVBQUMsQ0FBQztRQUNqQixDQUFDLENBQUM7UUFDRixJQUFJLGNBQWMsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxjQUFhLENBQUMsQ0FBQztRQUM1RCxVQUFVLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxjQUFjLENBQUM7UUFDOUMsY0FBYyxDQUFDLFFBQVEsR0FBRyxDQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsTUFBTSxDQUFDLENBQUM7UUFDakQsY0FBYyxDQUFDLDRCQUE0QixHQUFHLFVBQVMsT0FBTyxFQUFDLElBQUk7WUFDbEUsSUFBSSxHQUFHLEdBQUcsY0FBYyxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBQyx5QkFBeUIsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDOUYsSUFBSSxNQUFNLEdBQUcseUJBQXlCLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN6RCxJQUFJLElBQUksR0FBRyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3RELElBQUksVUFBVSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQztZQUMvQyxJQUFJLElBQUksR0FBRyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUM5QyxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7WUFDZCxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDWCxPQUFNLEVBQUUsR0FBRyxVQUFVLEVBQUU7Z0JBQ3RCLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDO2dCQUNiLElBQUksRUFBRSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMxRixJQUFJLEdBQUcsR0FBRyxnQkFBZ0IsQ0FBQyxzQkFBc0IsQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakgsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNmO1lBQ0QsT0FBTyxjQUFjLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQztRQUNGLGNBQWMsQ0FBQyxxQkFBcUIsR0FBRyxVQUFTLE9BQU87WUFDdEQsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQ2QsSUFBSSxFQUFFLEdBQUcsY0FBYyxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUMseUJBQXlCLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBQyxLQUFLLENBQUMsQ0FBQztZQUN2RyxJQUFJLEVBQUUsR0FBRyxjQUFjLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3RHLElBQUksRUFBRSxHQUFHLGNBQWMsQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFDLHlCQUF5QixDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUMsSUFBSSxDQUFDLENBQUM7WUFDdEcsSUFBSSxFQUFFLEdBQUcsY0FBYyxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBQyxJQUFJLENBQUMsQ0FBQztZQUNyRyxPQUFPLENBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxDQUFDLENBQUM7UUFDdEIsQ0FBQyxDQUFDO1FBQ0YsY0FBYyxDQUFDLGVBQWUsR0FBRyxVQUFTLE9BQU8sRUFBQyxDQUFDLEVBQUMsSUFBSTtZQUN2RCxJQUFHLElBQUksSUFBSSxJQUFJO2dCQUFFLElBQUksR0FBRyxLQUFLLENBQUM7WUFDOUIsSUFBSSxLQUFLLENBQUM7WUFDVixJQUFHLElBQUk7Z0JBQUUsS0FBSyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7O2dCQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO1lBQzdELElBQUksTUFBTSxDQUFDO1lBQ1gsSUFBRyxJQUFJO2dCQUFFLE1BQU0sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDOztnQkFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztZQUNqRSxJQUFJLFNBQVMsR0FBRyxpQkFBaUIsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM1RCxJQUFJLFlBQVksR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN0QixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDWixJQUFJLEVBQUUsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDO1lBQzFCLE9BQU0sR0FBRyxHQUFHLEVBQUUsRUFBRTtnQkFDZixJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztnQkFDZCxJQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUU7b0JBQ2pFLFlBQVksR0FBRyxDQUFDLENBQUM7b0JBQ2pCLE1BQU07aUJBQ047YUFDRDtZQUNELElBQUksZ0JBQWdCLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUNsQyxJQUFHLFlBQVksSUFBSSxDQUFDO2dCQUFFLGdCQUFnQixHQUFHLGdCQUFnQixHQUFHLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDekYsSUFBSSxNQUFNLENBQUM7WUFDWCxJQUFHLGdCQUFnQixHQUFHLENBQUM7Z0JBQUUsTUFBTSxHQUFHLGdCQUFnQixDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBQyxhQUFhLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFDLENBQUMsQ0FBQyxFQUFDLElBQUksQ0FBQyxDQUFDOztnQkFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDO1lBQ2hKLElBQUksSUFBSSxHQUFHLGNBQWMsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFDLENBQUMsRUFBQyxLQUFLLENBQUMsQ0FBQztZQUNuRCxJQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLHlCQUF5QixDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLG1CQUFtQixDQUFDLE9BQU87Z0JBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQztpQkFBTSxJQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLHlCQUF5QixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLG1CQUFtQixDQUFDLE9BQU87Z0JBQUUsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFBLENBQUMsQ0FBQSxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQSxDQUFDLENBQUEsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDelEsSUFBRyxJQUFJO2dCQUFFLE9BQU8sSUFBSSx3QkFBd0IsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUMsQ0FBQyxVQUFTLEtBQUs7b0JBQ3hGLElBQUksRUFBRSxDQUFDO29CQUNQLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztvQkFDYjt3QkFDQyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7d0JBQ2IsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQzt3QkFDaEMsT0FBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRTs0QkFDekIsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUNyQixFQUFFLElBQUksQ0FBQzs0QkFDUCxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO3lCQUNwQjtxQkFDRDtvQkFDRCxFQUFFLEdBQUcsR0FBRyxDQUFDO29CQUNULE9BQU8sRUFBRSxDQUFDO2dCQUNYLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDVixPQUFPLElBQUksd0JBQXdCLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBQyxNQUFNLENBQUMsTUFBTSxFQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM5RixDQUFDLENBQUM7UUFDRixjQUFjLENBQUMsYUFBYSxHQUFHLFVBQVMsTUFBTSxFQUFDLE9BQU87WUFDckQsTUFBTSxHQUFHLGdCQUFnQixDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3hELElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7WUFDL0IsSUFBRyxPQUFPLElBQUksSUFBSTtnQkFBRSxPQUFPLEdBQUcsQ0FBQyxDQUFDO1lBQ2hDLElBQUcsT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQztnQkFBRSxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFDNUQsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUM3QixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7WUFDaEIsSUFBSSxhQUFhLEdBQUcsRUFBRSxDQUFDO1lBQ3ZCLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNaLElBQUksRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDO1lBQ3hDLE9BQU0sR0FBRyxHQUFHLEVBQUUsRUFBRTtnQkFDZixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBQ2hCLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFTLENBQUM7b0JBQ2xDLE9BQU8sVUFBUyxDQUFDO3dCQUNoQixPQUFPLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzlCLENBQUMsQ0FBQztnQkFDSCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNQLElBQUksQ0FBQyxHQUFHLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNoRSxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDcEMsTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7YUFDakI7WUFDRCxPQUFPLElBQUksMEJBQTBCLENBQUMsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3BGLENBQUMsQ0FBQztRQUNGLGNBQWMsQ0FBQyxXQUFXLEdBQUcsVUFBUyxLQUFLO1lBQzFDLE9BQU8sSUFBSSx3QkFBd0IsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsVUFBUyxDQUFDO2dCQUN0RyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNsQixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDO1FBQ0YsY0FBYyxDQUFDLG1CQUFtQixHQUFHLFVBQVMsYUFBYSxFQUFDLE9BQU87WUFDbEUsSUFBSSxNQUFNLEdBQUcsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFDdEMsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQ2YsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQ1osSUFBSSxFQUFFLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUNwQixPQUFNLEdBQUcsR0FBRyxFQUFFLEVBQUU7Z0JBQ2YsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7Z0JBQ2QsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNoQjtZQUNELElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztZQUNiLElBQUksR0FBRyxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFDckIsT0FBTSxJQUFJLEdBQUcsR0FBRyxFQUFFO2dCQUNqQixJQUFJLEVBQUUsR0FBRyxJQUFJLEVBQUUsQ0FBQztnQkFDaEIsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNoQjtZQUNELElBQUcsT0FBTyxJQUFJLElBQUk7Z0JBQUUsT0FBTyxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBQyxHQUFHLENBQUMsQ0FBQztZQUMxRSxPQUFPLElBQUksd0JBQXdCLENBQUMsTUFBTSxFQUFDLEtBQUssRUFBQyxjQUFjLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ3RHLENBQUMsQ0FBQztRQUNGLGNBQWMsQ0FBQyxnQkFBZ0IsR0FBRyxVQUFTLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxNQUFNO1lBQzVELElBQUcsTUFBTSxJQUFJLElBQUk7Z0JBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUM5QixJQUFJLFdBQVcsR0FBRyxNQUFNLENBQUM7WUFDekIsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQ2IsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQ1osSUFBSSxFQUFFLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUNwQixPQUFNLEdBQUcsR0FBRyxFQUFFLEVBQUU7Z0JBQ2YsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7Z0JBQ2QsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO2dCQUNiLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztnQkFDWixJQUFJLEdBQUcsR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDO2dCQUNyQixPQUFNLEdBQUcsR0FBRyxHQUFHLEVBQUU7b0JBQ2hCLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO29CQUNkLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsV0FBVyxDQUFDO29CQUM5QixJQUFJLElBQUksR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBQyxFQUFFLEVBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ3ZDLElBQUksSUFBSSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLEVBQUUsRUFBQyxFQUFFLENBQUMsQ0FBQztvQkFDdkMsSUFBSSxHQUFHLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzlELEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ2QsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDZDtnQkFDRCxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ2Q7WUFDRCxJQUFJLEtBQUssR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUMsR0FBRyxDQUFDLENBQUM7WUFDOUMsSUFBSSxJQUFJLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzdDLE9BQU8sSUFBSSwwQkFBMEIsQ0FBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBQyxHQUFHLENBQUMsQ0FBQztRQUNoRyxDQUFDLENBQUM7UUFDRixjQUFjLENBQUMsVUFBVSxHQUFHLFVBQVMsTUFBTSxFQUFDLEtBQUssRUFBQyxLQUFLLEVBQUMsVUFBVSxFQUFDLFFBQVE7WUFDMUUsSUFBSSxPQUFPLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN4QyxJQUFJLE9BQU8sR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hDLEtBQUssR0FBRyxhQUFhLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hDLEtBQUssR0FBRyxhQUFhLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hDLElBQUcsUUFBUSxHQUFHLFVBQVU7Z0JBQUUsUUFBUSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLFVBQVUsQ0FBQztZQUNoRSxJQUFJLEtBQUssR0FBRyxRQUFRLEdBQUcsVUFBVSxDQUFDO1lBQ2xDLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztZQUNoQixJQUFHLEtBQUssSUFBSSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUM7Z0JBQUUsT0FBTyxHQUFHLENBQUMsQ0FBQztpQkFBTSxJQUFHLEtBQUssSUFBSSxJQUFJLENBQUMsRUFBRTtnQkFBRSxPQUFPLEdBQUcsQ0FBQyxDQUFDO2lCQUFNLElBQUcsS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUM7Z0JBQUUsT0FBTyxHQUFHLENBQUMsQ0FBQzs7Z0JBQU0sT0FBTyxHQUFHLENBQUMsQ0FBQztZQUM3SSxJQUFJLE1BQU0sR0FBRyxLQUFLLEdBQUcsT0FBTyxDQUFDO1lBQzdCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUM7WUFDcEIsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDOUIsSUFBSSxFQUFFLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFDLEtBQUssQ0FBQyxFQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RLLElBQUksRUFBRSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFDLEtBQUssQ0FBQyxFQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3hILElBQUksYUFBYSxHQUFHLEVBQUUsQ0FBQztZQUN2QixJQUFJLEtBQUssR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDbkQsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQ2QsSUFBSSxLQUFLLEdBQUcsVUFBVSxDQUFDO1lBQ3ZCLElBQUksT0FBTyxHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2pELGFBQWEsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDdEIsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUNqQixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDWixJQUFJLEVBQUUsR0FBRyxPQUFPLEdBQUcsQ0FBQyxDQUFDO1lBQ3JCLE9BQU0sR0FBRyxHQUFHLEVBQUUsRUFBRTtnQkFDZixJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztnQkFDZCxLQUFLLElBQUksTUFBTSxDQUFDO2dCQUNoQixJQUFJLEVBQUUsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBQyxhQUFhLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUMsS0FBSyxDQUFDLEVBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVKLE9BQU8sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN2QixhQUFhLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDOUIsSUFBSSxFQUFFLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUMsS0FBSyxDQUFDLEVBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQzlHLElBQUksTUFBTSxHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBQyxFQUFFLENBQUMsRUFBQyxFQUFFLEVBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUMvSSxJQUFJLEVBQUUsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDL0QsT0FBTyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ3hCLGFBQWEsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUM5QixLQUFLLElBQUksQ0FBQyxDQUFDO2dCQUNYLElBQUcsQ0FBQyxHQUFHLE9BQU8sRUFBRTtvQkFDZixFQUFFLEdBQUcsRUFBRSxDQUFDO29CQUNSLEVBQUUsR0FBRyxFQUFFLENBQUM7aUJBQ1I7YUFDRDtZQUNELElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLEdBQUcsQ0FBQyxDQUFDO1lBQ3hCLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNaLE9BQU0sR0FBRyxHQUFHLENBQUMsRUFBRTtnQkFDZCxJQUFJLEVBQUUsR0FBRyxHQUFHLEVBQUUsQ0FBQztnQkFDZixLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDO2dCQUNoQixLQUFLLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQzthQUNwQjtZQUNELFFBQU8sT0FBTyxFQUFFO2dCQUNoQixLQUFLLENBQUM7b0JBQ0wsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7b0JBQzFCLE1BQU07Z0JBQ1AsS0FBSyxDQUFDO29CQUNMLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsb0JBQW9CLENBQUM7b0JBQzNDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsbUJBQW1CLENBQUM7b0JBQzFDLE1BQU07Z0JBQ1AsS0FBSyxDQUFDO29CQUNMLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO29CQUMzQixLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztvQkFDMUIsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7b0JBQzNCLE1BQU07YUFDTjtZQUNELE9BQU8sSUFBSSx3QkFBd0IsQ0FBQyxDQUFDLEVBQUMsS0FBSyxFQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDakcsQ0FBQyxDQUFDO1FBQ0YsY0FBYyxDQUFDLEdBQUcsR0FBRyxVQUFTLE1BQU0sRUFBQyxLQUFLLEVBQUMsS0FBSyxFQUFDLE1BQU0sRUFBQyxVQUFVLEVBQUMsUUFBUTtZQUMxRSxPQUFPLGNBQWMsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBQyxhQUFhLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUMsVUFBVSxFQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2xMLENBQUMsQ0FBQztRQUNGLGNBQWMsQ0FBQyxRQUFRLEdBQUcsVUFBUyxHQUFHO1lBQ3JDLElBQUksS0FBSyxHQUFHLENBQUMsR0FBRyxFQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3RCLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQztZQUNmLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNaLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQ3hCLE9BQU0sR0FBRyxHQUFHLEVBQUUsRUFBRTtnQkFDZixJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztnQkFDZCxJQUFJLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5QyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2pCO1lBQ0QsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNqQixLQUFLLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFDLElBQUksT0FBTyxDQUFDO1lBQ1osSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQ2IsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQ2IsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztZQUN0QixPQUFNLElBQUksR0FBRyxJQUFJLEVBQUU7Z0JBQ2xCLElBQUksRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDO2dCQUNoQixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ2Q7WUFDRCxPQUFPLEdBQUcsR0FBRyxDQUFDO1lBQ2QsT0FBTyxJQUFJLHdCQUF3QixDQUFDLENBQUMsRUFBQyxLQUFLLEVBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDaEcsQ0FBQyxDQUFDO1FBQ0YsY0FBYyxDQUFDLGVBQWUsR0FBRyxVQUFTLElBQUksRUFBQyxNQUFNLEVBQUMsT0FBTztZQUM1RCxJQUFJLGFBQWEsR0FBRyxDQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxDQUFDLENBQUM7WUFDL0IsSUFBSSxPQUFPLEdBQUcsQ0FBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3pCLElBQUksa0JBQWtCLEdBQUcsY0FBYyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDOUUsSUFBSSxZQUFZLEdBQUcsY0FBYyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDbEUsSUFBSSxXQUFXLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUMsSUFBSSxDQUFDLENBQUM7WUFDakQsSUFBSSxlQUFlLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsTUFBTSxFQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNELElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNaLElBQUksRUFBRSxHQUFHLGtCQUFrQixDQUFDLE1BQU0sQ0FBQztZQUNuQyxPQUFNLEdBQUcsR0FBRyxFQUFFLEVBQUU7Z0JBQ2YsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7Z0JBQ2QsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1QyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0UsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDaEM7WUFDRCxPQUFPLElBQUksMEJBQTBCLENBQUMsQ0FBQyxFQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUN4SSxDQUFDLENBQUM7UUFDRixjQUFjLENBQUMsa0JBQWtCLEdBQUcsVUFBUyxJQUFJLEVBQUMsS0FBSyxFQUFDLElBQUksRUFBQyxNQUFNLEVBQUMsTUFBTTtZQUN6RSxJQUFJLEtBQUssR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksRUFBQyxLQUFLLENBQUMsQ0FBQztZQUM1QyxJQUFJLEtBQUssR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUMxQixJQUFJLElBQUksR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksRUFBQyxLQUFLLEVBQUMsS0FBSyxFQUFDLE1BQU0sRUFBQyxHQUFHLEVBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN2RSxPQUFPLGNBQWMsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFDLE1BQU0sRUFBQyxJQUFJLENBQUMsQ0FBQztRQUN6RCxDQUFDLENBQUM7UUFDRixjQUFjLENBQUMsZUFBZSxHQUFHLFVBQVMsT0FBTyxFQUFDLE1BQU0sRUFBQyxJQUFJLEVBQUMsS0FBSztZQUNsRSxJQUFJLGtCQUFrQixHQUFHLGNBQWMsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzlFLElBQUksWUFBWSxHQUFHLGNBQWMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ2xFLElBQUksS0FBSyxDQUFDO1lBQ1YsSUFBSSxNQUFNLENBQUM7WUFDWCxJQUFJLGFBQWEsQ0FBQztZQUNsQixJQUFJLE9BQU8sQ0FBQztZQUNaLElBQUcsS0FBSyxJQUFJLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFO2dCQUN4QixLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUNWLE1BQU0sR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNwRDtpQkFBTSxJQUFHLEtBQUssSUFBSSxJQUFJLENBQUMsRUFBRSxFQUFFO2dCQUMzQixLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUNWLE1BQU0sR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEQsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7YUFDNUI7aUJBQU0sSUFBRyxLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFO2dCQUNuQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUNWLE1BQU0sR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEQsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxvQkFBb0IsQ0FBQztnQkFDN0MsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxtQkFBbUIsQ0FBQzthQUM1QztpQkFBTTtnQkFDTixLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUNWLE1BQU0sR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEQsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7Z0JBQzdCLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO2dCQUM1QixNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQzthQUM3QjtZQUNELElBQUksTUFBTSxHQUFHLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDM0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztZQUM1QixJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDWCxPQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUU7Z0JBQ2IsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7Z0JBQ2IsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztnQkFDaEIsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7YUFDcEI7WUFDRCxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO1lBQ2xCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQ2hDLElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQztZQUNoQixJQUFJLEtBQUssR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztZQUM3QyxJQUFJLE9BQU8sR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztZQUMvQyxJQUFJLGNBQWMsR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxFQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBQyxDQUFDLENBQUMsQ0FBQztZQUN0RixJQUFJLFFBQVEsR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxFQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzlFLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNaLElBQUksR0FBRyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7WUFDcEIsT0FBTSxHQUFHLEdBQUcsR0FBRyxFQUFFO2dCQUNoQixJQUFJLEVBQUUsR0FBRyxHQUFHLEVBQUUsQ0FBQztnQkFDZixLQUFLLElBQUksTUFBTSxDQUFDO2dCQUNoQixPQUFPLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDOUIsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDNUI7WUFDRCxJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7WUFDYixJQUFJLEdBQUcsR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLENBQUM7WUFDcEMsT0FBTSxJQUFJLEdBQUcsR0FBRyxFQUFFO2dCQUNqQixJQUFJLEVBQUUsR0FBRyxJQUFJLEVBQUUsQ0FBQztnQkFDaEIsSUFBSSxDQUFDLEdBQUcsY0FBYyxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQUMsRUFBQyxNQUFNLEVBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzNFLElBQUksQ0FBQyxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BELElBQUksQ0FBQyxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlCLElBQUksQ0FBQyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwQyxJQUFHLENBQUMsR0FBRyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUU7b0JBQ25DLENBQUMsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQy9CLENBQUMsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQy9CO2dCQUNELGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxrQkFBa0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDL0MsSUFBSSxFQUFFLEdBQUcsa0JBQWtCLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ2hDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ25DLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDWCxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7Z0JBQ2QsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDO2dCQUNqQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7Z0JBQ2IsSUFBSSxJQUFJLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQztnQkFDckIsT0FBTSxJQUFJLEdBQUcsSUFBSSxFQUFFO29CQUNsQixJQUFJLEVBQUUsR0FBRyxJQUFJLEVBQUUsQ0FBQztvQkFDaEIsSUFBSSxFQUFFLENBQUM7b0JBQ1AsSUFBRyxDQUFDLElBQUksQ0FBQzt3QkFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDOzt3QkFBTSxFQUFFLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDN0ksY0FBYyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7b0JBQ25DLFFBQVEsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUMzQyxJQUFJLEVBQUUsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzVGLElBQUcsQ0FBQyxJQUFJLENBQUM7d0JBQUUsY0FBYyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7eUJBQU07d0JBQ2xELElBQUksTUFBTSxHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBQyxFQUFFLENBQUMsRUFBQyxFQUFFLEVBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUMvSSxJQUFJLEVBQUUsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDL0QsY0FBYyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7cUJBQ25DO29CQUNELFFBQVEsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDaEQsS0FBSyxJQUFJLENBQUMsQ0FBQztvQkFDWCxJQUFHLEVBQUUsR0FBRyxLQUFLLEVBQUU7d0JBQ2QsRUFBRSxHQUFHLEVBQUUsQ0FBQzt3QkFDUixFQUFFLEdBQUcsRUFBRSxDQUFDO3FCQUNSO2lCQUNEO2FBQ0Q7WUFDRCxPQUFPLElBQUksMEJBQTBCLENBQUMsQ0FBQyxFQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUNuSSxDQUFDLENBQUM7UUFDRixjQUFjLENBQUMsZ0JBQWdCLEdBQUcsVUFBUyxNQUFNLEVBQUMsSUFBSSxFQUFDLEtBQUssRUFBQyxNQUFNO1lBQ2xFLElBQUksR0FBRyxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFDLE1BQU0sRUFBQyxHQUFHLEVBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzNGLE9BQU8sY0FBYyxDQUFDLGVBQWUsQ0FBQyxHQUFHLEVBQUMsTUFBTSxFQUFDLElBQUksRUFBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3BFLENBQUMsQ0FBQztRQUNGLGNBQWMsQ0FBQyxjQUFjLEdBQUcsVUFBUyxJQUFJLEVBQUMsS0FBSyxFQUFDLElBQUksRUFBQyxNQUFNLEVBQUMsTUFBTTtZQUNyRSxJQUFJLEtBQUssR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUN4QixJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUM7WUFDcEIsSUFBSSxhQUFhLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksRUFBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNySSxJQUFJLFVBQVUsR0FBRyxDQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ25DLElBQUksWUFBWSxHQUFHLENBQUMsR0FBRyxFQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzdCLElBQUksSUFBSSxHQUFHLElBQUksd0JBQXdCLENBQUMsV0FBVyxFQUFDLFVBQVUsRUFBQyxjQUFjLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ3hILE9BQU8sY0FBYyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxLQUFLLENBQUMsQ0FBQztRQUM3RCxDQUFDLENBQUM7UUFDRixjQUFjLENBQUMsbUJBQW1CLEdBQUcsVUFBUyxNQUFNLEVBQUMsTUFBTSxFQUFDLGlCQUFpQixFQUFDLGFBQWEsRUFBQyxXQUFXO1lBQ3RHLElBQUcsaUJBQWlCLElBQUksSUFBSTtnQkFBRSxpQkFBaUIsR0FBRyxLQUFLLENBQUM7WUFDeEQsSUFBRyxNQUFNLElBQUksSUFBSTtnQkFBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQzlCLElBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLEdBQUcsQ0FBQztnQkFBRSxNQUFNLElBQUksbUJBQW1CLENBQUMsbUVBQW1FLEdBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsQ0FBQztZQUMvSixJQUFJLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQ1osSUFBSSxFQUFFLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUN2QixPQUFNLEdBQUcsR0FBRyxFQUFFLEVBQUU7Z0JBQ2YsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7Z0JBQ2QsSUFBSSxLQUFLLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDM0UsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQzdCLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDO2FBQ3RCO1lBQ0QsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDNUIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQ2IsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQztZQUNwQixPQUFNLElBQUksR0FBRyxHQUFHLEVBQUU7Z0JBQ2pCLElBQUksRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDO2dCQUNoQixFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQzthQUN0QjtZQUNELElBQUksVUFBVSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBQyxHQUFHLENBQUMsQ0FBQztZQUNuRCxJQUFJLFdBQVcsR0FBRyxhQUFhLElBQUksSUFBSSxJQUFJLFdBQVcsSUFBSSxJQUFJLENBQUM7WUFDL0QsSUFBSSxLQUFLLENBQUM7WUFDVixJQUFHLFdBQVc7Z0JBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQzs7Z0JBQU0sS0FBSyxHQUFHLENBQUMsQ0FBQztZQUMxQyxJQUFJLEdBQUcsQ0FBQztZQUNSLElBQUcsV0FBVztnQkFBRSxHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDOztnQkFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7WUFDNUUsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDO1lBQ2hCLE9BQU0sR0FBRyxHQUFHLEdBQUcsRUFBRTtnQkFDaEIsSUFBSSxFQUFFLEdBQUcsR0FBRyxFQUFFLENBQUM7Z0JBQ2YsSUFBSSxVQUFVLEdBQUcsR0FBRyxDQUFDO2dCQUNyQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7Z0JBQ2IsT0FBTSxJQUFJLEdBQUcsTUFBTSxFQUFFO29CQUNwQixJQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQztvQkFDZixVQUFVLElBQUksRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztpQkFDekI7Z0JBQ0QsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsTUFBTSxHQUFHLFVBQVUsQ0FBQyxDQUFDO2FBQ3pDO1lBQ0QsSUFBSSxLQUFLLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNqRSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDWCxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUcsV0FBVztnQkFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7O2dCQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUNsRSxJQUFJLEdBQUcsQ0FBQztZQUNSLElBQUcsV0FBVztnQkFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDOztnQkFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQ3RDLElBQUksRUFBRSxDQUFDO1lBQ1AsSUFBRyxXQUFXO2dCQUFFLEVBQUUsR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDOztnQkFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztZQUMxRixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDWixPQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFO2dCQUN0QixJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2hCLEVBQUUsR0FBRyxDQUFDO2dCQUNOLElBQUksSUFBSSxHQUFHLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxDQUFDLEVBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzNELElBQUksVUFBVSxHQUFHLGNBQWMsQ0FBQyxnQ0FBZ0MsQ0FBQyxJQUFJLEVBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxLQUFLLENBQUMsQ0FBQztnQkFDdEYsSUFBSSxFQUFFLEdBQUcsSUFBSSxHQUFHLE1BQU0sQ0FBQztnQkFDdkIsSUFBSSxRQUFRLEdBQUcsYUFBYSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDekMsSUFBSSxNQUFNLEdBQUcsYUFBYSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBQzVDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzthQUNuRDtZQUNELElBQUcsV0FBVyxFQUFFO2dCQUNmLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO2dCQUN6QixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQzNELElBQUksT0FBTyxHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDM0QseUJBQXlCLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUN6RCx5QkFBeUIsQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFDLENBQUMsRUFBQyxPQUFPLENBQUMsQ0FBQzthQUNwRTtZQUNELElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7WUFDM0IsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDO1lBQ1osSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1lBQzVELElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1lBQ3ZDLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNaLE9BQU0sR0FBRyxHQUFHLEdBQUcsRUFBRTtnQkFDaEIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLENBQUMsQ0FBQztnQkFDTixJQUFHLENBQUMsV0FBVztvQkFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQVMsRUFBRTt3QkFDM0MsT0FBTyxVQUFTLEVBQUU7NEJBQ2pCLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNsQixDQUFDLENBQUM7b0JBQ0gsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztxQkFBTTtvQkFDYixDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdkIsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3JDLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztvQkFDYixJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztvQkFDN0IsT0FBTSxJQUFJLEdBQUcsSUFBSSxFQUFFO3dCQUNsQixJQUFJLEVBQUUsR0FBRyxJQUFJLEVBQUUsQ0FBQzt3QkFDaEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDMUI7b0JBQ0QsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ25DLENBQUMsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3REO2dCQUNELElBQUksQ0FBQyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ1g7WUFDRCxJQUFJLFVBQVUsR0FBRyxhQUFhLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzdDLElBQUcsQ0FBQyxpQkFBaUIsRUFBRTtnQkFDdEIsSUFBSSxPQUFPLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN2RCxVQUFVLEdBQUcsY0FBYyxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUMsT0FBTyxDQUFDLENBQUM7YUFDN0Q7WUFDRCxPQUFPLElBQUksd0JBQXdCLENBQUMsTUFBTSxFQUFDLEtBQUssRUFBQyxVQUFVLENBQUMsQ0FBQztRQUM5RCxDQUFDLENBQUM7UUFDRixJQUFJLGdCQUFnQixHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLGNBQWEsQ0FBQyxDQUFDO1FBQ2hFLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLGdCQUFnQixDQUFDO1FBQ2xELGdCQUFnQixDQUFDLFFBQVEsR0FBRyxDQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsUUFBUSxDQUFDLENBQUM7UUFDckQsZ0JBQWdCLENBQUMsWUFBWSxHQUFHLFVBQVMsS0FBSztZQUM3QyxPQUFPLElBQUksd0JBQXdCLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFDLHlCQUF5QixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUN0SixDQUFDLENBQUM7UUFDRixnQkFBZ0IsQ0FBQyxjQUFjLEdBQUcsVUFBUyxPQUFPLEVBQUMsSUFBSTtZQUN0RCxJQUFHLElBQUksSUFBSSxJQUFJO2dCQUFFLElBQUksR0FBRyxLQUFLLENBQUM7WUFDOUIsSUFBRyxJQUFJO2dCQUFFLE9BQU8sSUFBSSwwQkFBMEIsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUMsT0FBTyxDQUFDLE1BQU0sRUFBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFDLENBQUMsVUFBUyxLQUFLO29CQUMxSixJQUFJLEVBQUUsQ0FBQztvQkFDUCxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUM7b0JBQ1o7d0JBQ0MsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO3dCQUNaLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUM7d0JBQ2hDLE9BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUU7NEJBQ3ZCLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQzs0QkFDbkIsRUFBRSxHQUFHLENBQUM7NEJBQ04sRUFBRSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzt5QkFDakQ7cUJBQ0Q7b0JBQ0QsRUFBRSxHQUFHLEVBQUUsQ0FBQztvQkFDUixPQUFPLEVBQUUsQ0FBQztnQkFDWCxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1YsT0FBTyxJQUFJLDBCQUEwQixDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUMsT0FBTyxDQUFDLE9BQU8sRUFBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUMseUJBQXlCLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1FBQy9MLENBQUMsQ0FBQztRQUNGLGdCQUFnQixDQUFDLFlBQVksR0FBRyxVQUFTLEtBQUs7WUFDN0MsSUFBSSxHQUFHLEdBQUcseUJBQXlCLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2pELElBQUksR0FBRyxHQUFHLHlCQUF5QixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoRCxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2QsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztZQUN2QixJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDWCxPQUFNLEVBQUUsR0FBRyxHQUFHLEVBQUU7Z0JBQ2YsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7Z0JBQ2IsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDekQ7WUFDRCxPQUFPLENBQUMsQ0FBQztRQUNWLENBQUMsQ0FBQztRQUNGLGdCQUFnQixDQUFDLHFCQUFxQixHQUFHLFVBQVMsTUFBTTtZQUN2RCxNQUFNLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDaEQsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUMsVUFBUyxDQUFDLEVBQUMsQ0FBQztnQkFDOUMsT0FBTyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBQyxDQUFDLENBQUMsQ0FBQztZQUMxQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7WUFDTCxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDWixJQUFJLEVBQUUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ3ZCLE9BQU0sR0FBRyxHQUFHLEVBQUUsRUFBRTtnQkFDZixJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztnQkFDZCxJQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsU0FBUztvQkFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQ3RHO1lBQ0QsSUFBSSxhQUFhLENBQUM7WUFDbEIsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQ2IsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQ2IsT0FBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRTtnQkFDM0IsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNyQixFQUFFLElBQUksQ0FBQztnQkFDUCxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksa0JBQWtCLENBQUMseUJBQXlCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNuSDtZQUNELGFBQWEsR0FBRyxHQUFHLENBQUM7WUFDcEIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQ2IsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUN6QixPQUFNLElBQUksR0FBRyxJQUFJLEVBQUU7Z0JBQ2xCLElBQUksRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDO2dCQUNoQixJQUFJLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbEMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQVMsR0FBRztvQkFDcEQsT0FBTyxVQUFTLEVBQUU7d0JBQ2pCLE9BQU8sRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDcEIsQ0FBQyxDQUFDO2dCQUNILENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDVDtZQUNELElBQUksU0FBUyxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsVUFBUyxFQUFFO2dCQUM1QyxPQUFPLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQztZQUN4QixDQUFDLENBQUMsQ0FBQztZQUNILElBQUksV0FBVyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFDLFVBQVMsRUFBRSxFQUFDLEVBQUU7Z0JBQ3JELE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsRUFBRSxDQUFDLENBQUM7WUFDeEIsQ0FBQyxFQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ1AsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQ2IsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUN6QixPQUFNLElBQUksR0FBRyxJQUFJLEVBQUU7Z0JBQ2xCLElBQUksRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDO2dCQUNoQixJQUFJLEtBQUssR0FBRyxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDMUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQVMsS0FBSztvQkFDdEQsT0FBTyxVQUFTLEVBQUU7d0JBQ2pCLE9BQU8sRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdEIsQ0FBQyxDQUFDO2dCQUNILENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7YUFDWDtZQUNELElBQUksV0FBVyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFDLFVBQVMsRUFBRSxFQUFDLEVBQUU7Z0JBQ2xELE9BQU8sYUFBYSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2xELENBQUMsRUFBQyxFQUFFLENBQUMsQ0FBQztZQUNOLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztZQUNiLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFDekIsT0FBTSxJQUFJLEdBQUcsSUFBSSxFQUFFO2dCQUNsQixJQUFJLEVBQUUsR0FBRyxJQUFJLEVBQUUsQ0FBQztnQkFDaEIsSUFBSSxHQUFHLEdBQUcsYUFBYSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNuRSxJQUFHLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQztvQkFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUM1QyxNQUFNLENBQUMsRUFBRSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBQyxHQUFHLENBQUMsQ0FBQzthQUM5RDtZQUNELE9BQU8sTUFBTSxDQUFDO1FBQ2YsQ0FBQyxDQUFDO1FBQ0YsZ0JBQWdCLENBQUMsSUFBSSxHQUFHLFVBQVMsQ0FBQyxFQUFDLENBQUM7WUFDbkMsSUFBRyxDQUFDLEdBQUcsQ0FBQztnQkFBRSxPQUFPLENBQUMsQ0FBQzs7Z0JBQU0sT0FBTyxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDO1FBQ0YsZ0JBQWdCLENBQUMsSUFBSSxHQUFHLFVBQVMsQ0FBQyxFQUFDLENBQUM7WUFDbkMsSUFBRyxDQUFDLEdBQUcsQ0FBQztnQkFBRSxPQUFPLENBQUMsQ0FBQzs7Z0JBQU0sT0FBTyxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDO1FBQ0YsZ0JBQWdCLENBQUMsa0JBQWtCLEdBQUcsVUFBUyxLQUFLLEVBQUMsV0FBVztZQUMvRCxJQUFHLFdBQVcsSUFBSSxLQUFLLENBQUMsTUFBTTtnQkFBRSxPQUFPLEtBQUssQ0FBQztZQUM3QyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUM5QyxJQUFJLFNBQVMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO1lBQzdCLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDeEIsSUFBSSxhQUFhLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQztZQUN4QyxJQUFJLFNBQVMsR0FBRyxXQUFXLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztZQUMzQyxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztZQUN4QyxJQUFJLE9BQU8sR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxTQUFTLEdBQUcsQ0FBQyxFQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUM3RSxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7WUFDZCxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDZixJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFDbEIsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1lBQzFCLElBQUksRUFBRSxHQUFHLFdBQVcsQ0FBQztZQUNyQixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUM3QixJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUM7WUFDWixJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUM7WUFDWixJQUFJLEVBQUUsQ0FBQztZQUNQLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7WUFDcEIsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUM3QixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDWixJQUFJLEVBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLE9BQU0sR0FBRyxHQUFHLEVBQUUsRUFBRTtnQkFDZixJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztnQkFDZCxJQUFJLEdBQUcsR0FBRyxHQUFHLEdBQUcsa0JBQWtCLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0MsSUFBSSxHQUFHLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0MsSUFBSSxHQUFHLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUM7Z0JBQ2pELElBQUksR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQ2xCLE9BQU0sR0FBRyxHQUFHLEdBQUcsRUFBRTtvQkFDaEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7b0JBQ2QsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFDLENBQUMsQ0FBQyxHQUFHLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2lCQUNwRzthQUNEO1lBQ0QsSUFBSSxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNsQixPQUFNLEdBQUcsR0FBRyxFQUFFLEVBQUU7Z0JBQ2YsSUFBSSxFQUFFLEdBQUcsR0FBRyxFQUFFLENBQUM7Z0JBQ2YsSUFBSSxJQUFJLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBQyxFQUFFLENBQUMsQ0FBQztnQkFDL0MsSUFBSSxJQUFJLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBQyxFQUFFLEdBQUcsU0FBUyxDQUFDLENBQUM7Z0JBQ25ELElBQUksSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLENBQUM7Z0JBQ3BCLE9BQU0sSUFBSSxHQUFHLElBQUksRUFBRTtvQkFDbEIsSUFBSSxFQUFFLEdBQUcsSUFBSSxFQUFFLENBQUM7b0JBQ2hCLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsQ0FBQztpQkFDbkQ7YUFDRDtZQUNELElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQztZQUNaLElBQUksSUFBSSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDbEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDWCxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUM7WUFDbEIsSUFBSSxDQUFDLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQztZQUN0QixJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7WUFDYixJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7WUFDYixJQUFJLEdBQUcsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLE9BQU0sSUFBSSxHQUFHLEdBQUcsRUFBRTtnQkFDakIsSUFBSSxFQUFFLEdBQUcsSUFBSSxFQUFFLENBQUM7Z0JBQ2hCLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7YUFDWjtZQUNELElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztZQUNiLElBQUksR0FBRyxHQUFHLFNBQVMsR0FBRyxDQUFDLENBQUM7WUFDeEIsT0FBTSxJQUFJLEdBQUcsR0FBRyxFQUFFO2dCQUNqQixJQUFJLEVBQUUsR0FBRyxJQUFJLEVBQUUsQ0FBQztnQkFDaEIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUM3QjtZQUNELE9BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDWixJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ1gsT0FBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbkQsSUFBSSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ3JCLElBQUksR0FBRyxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsU0FBUyxDQUFDO2dCQUMvQixJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztnQkFDYixDQUFDLEdBQUcsU0FBUyxHQUFHLEdBQUcsQ0FBQztnQkFDcEIsSUFBSSxHQUFHLENBQUM7Z0JBQ1IsSUFBRyxJQUFJLEdBQUcsQ0FBQztvQkFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzs7b0JBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQztnQkFDNUQsSUFBSSxHQUFHLENBQUM7Z0JBQ1IsSUFBRyxDQUFDLEdBQUcsQ0FBQztvQkFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7O29CQUFNLEdBQUcsR0FBRyxFQUFFLENBQUM7Z0JBQzVELElBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDVCxJQUFJLEtBQUssR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDO29CQUNwQixJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7b0JBQ2QsSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDO29CQUNsQixPQUFNLENBQUMsR0FBRyxHQUFHLEVBQUU7d0JBQ2QsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQzt3QkFDaEQsQ0FBQyxFQUFFLENBQUM7cUJBQ0o7b0JBQ0QsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO29CQUNiLElBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ2hCLE9BQU0sSUFBSSxHQUFHLEdBQUcsRUFBRTt3QkFDakIsSUFBSSxFQUFFLEdBQUcsSUFBSSxFQUFFLENBQUM7d0JBQ2hCLElBQUksSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7d0JBQ2xCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUM7d0JBQ2pCLElBQUksRUFBRSxHQUFHLFNBQVMsQ0FBQzt3QkFDbkIsT0FBTSxFQUFFLElBQUksQ0FBQyxFQUFFOzRCQUNkLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUMxSCxFQUFFLEVBQUUsQ0FBQzt5QkFDTDt3QkFDRCxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO3FCQUNqQztpQkFDRDtnQkFDRCxJQUFJLElBQUksR0FBRyxHQUFHLENBQUM7Z0JBQ2YsSUFBSSxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDakIsT0FBTSxJQUFJLEdBQUcsR0FBRyxFQUFFO29CQUNqQixJQUFJLEVBQUUsR0FBRyxJQUFJLEVBQUUsQ0FBQztvQkFDaEIsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3ZDLElBQUksSUFBSSxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUMsRUFBRSxDQUFDLENBQUM7b0JBQy9DLElBQUksSUFBSSxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsRUFBRSxHQUFHLFNBQVMsQ0FBQyxDQUFDO29CQUNuRCxJQUFJLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDO29CQUNwQixPQUFNLElBQUksR0FBRyxJQUFJLEVBQUU7d0JBQ2xCLElBQUksRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDO3dCQUNoQixLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDckY7aUJBQ0Q7Z0JBQ0QsSUFBRyxJQUFJLEdBQUcsQ0FBQyxFQUFFO29CQUNaLElBQUksS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUM7b0JBQ3JCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztvQkFDaEIsSUFBSSxHQUFHLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztvQkFDbEIsSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztvQkFDcEMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO29CQUNaLE9BQU0sR0FBRyxHQUFHLElBQUksRUFBRTt3QkFDakIsSUFBSSxFQUFFLEdBQUcsR0FBRyxFQUFFLENBQUM7d0JBQ2YsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDO3dCQUNmLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQzt3QkFDZCxJQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQzt3QkFDdkIsT0FBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTs0QkFDbkIsSUFBRyxFQUFFLEdBQUcsSUFBSSxFQUFFO2dDQUNiLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dDQUN4QyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs2QkFDbkQ7NEJBQ0QsSUFBRyxFQUFFLElBQUksR0FBRyxFQUFFO2dDQUNiLElBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxJQUFJLEdBQUcsRUFBRSxHQUFHLElBQUksRUFBRTtvQ0FDL0IsSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztvQ0FDbkMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBQyxLQUFLLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7aUNBQzVEOzZCQUNEOztnQ0FBTSxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDbkUsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7NEJBQ1osRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7NEJBQ1osRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7eUJBQ1o7d0JBQ0QsS0FBSyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7d0JBQ2xCLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDO3FCQUNoQjtpQkFDRDtnQkFDRCxJQUFHLENBQUMsSUFBSSxTQUFTLEVBQUU7b0JBQ2xCLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztvQkFDYixJQUFJLElBQUksR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDO29CQUNyQixPQUFNLElBQUksR0FBRyxJQUFJLEVBQUU7d0JBQ2xCLElBQUksRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDO3dCQUNoQixFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO3dCQUNkLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDO3FCQUNoQjtpQkFDRDtnQkFDRCxJQUFJLElBQUksR0FBRyxHQUFHLENBQUM7Z0JBQ2YsSUFBSSxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztnQkFDbkIsT0FBTSxJQUFJLEdBQUcsSUFBSSxFQUFFO29CQUNsQixJQUFJLEVBQUUsR0FBRyxJQUFJLEVBQUUsQ0FBQztvQkFDaEIsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDckIsSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLENBQUM7aUJBQ2hCO2dCQUNELElBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDVCxJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7b0JBQ2IsT0FBTSxJQUFJLEdBQUcsQ0FBQyxFQUFFO3dCQUNmLElBQUksRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDO3dCQUNoQixJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3FCQUN4QjtvQkFDRCxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7b0JBQ2QsSUFBSSxJQUFJLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQztvQkFDekIsT0FBTSxLQUFLLEdBQUcsSUFBSSxFQUFFO3dCQUNuQixJQUFJLEVBQUUsR0FBRyxLQUFLLEVBQUUsQ0FBQzt3QkFDakIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxDQUFDLEdBQUcsU0FBUyxHQUFHLEVBQUUsQ0FBQyxDQUFDO3FCQUM3QztvQkFDRCxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNOLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNWLEVBQUUsR0FBRyxFQUFFLENBQUM7aUJBQ1I7cUJBQU07b0JBQ04sSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO29CQUNkLElBQUksSUFBSSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ2xCLE9BQU0sS0FBSyxHQUFHLElBQUksRUFBRTt3QkFDbkIsSUFBSSxFQUFFLEdBQUcsS0FBSyxFQUFFLENBQUM7d0JBQ2pCLEVBQUUsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO3FCQUNuQjtpQkFDRDthQUNEO1lBQ0QsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLE9BQU8sSUFBSSx3QkFBd0IsQ0FBQyxXQUFXLEVBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3hELENBQUMsQ0FBQztRQUNGLGdCQUFnQixDQUFDLHdCQUF3QixHQUFHLFVBQVMsT0FBTyxFQUFDLEdBQUc7WUFDL0QsSUFBSSxHQUFHLEdBQUcsY0FBYyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDL0QsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQ1osSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztZQUNwQixPQUFNLEdBQUcsR0FBRyxFQUFFLEVBQUU7Z0JBQ2YsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7Z0JBQ2QsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUNaLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7Z0JBQ3hCLE9BQU0sR0FBRyxHQUFHLEdBQUcsRUFBRTtvQkFDaEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7b0JBQ2QsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNqQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO2lCQUNyRTthQUNEO1lBQ0QsT0FBTyxJQUFJLDBCQUEwQixDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUMsT0FBTyxDQUFDLE9BQU8sRUFBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RNLENBQUMsQ0FBQztRQUNGLGdCQUFnQixDQUFDLHNCQUFzQixHQUFHLFVBQVMsS0FBSyxFQUFDLEdBQUc7WUFDM0QsSUFBSSxHQUFHLEdBQUcsY0FBYyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDN0QsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQ1osSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztZQUNwQixPQUFNLEdBQUcsR0FBRyxFQUFFLEVBQUU7Z0JBQ2YsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7Z0JBQ2QsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNqQixHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQ2xFO1lBQ0QsT0FBTyxJQUFJLHdCQUF3QixDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBQyxjQUFjLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckosQ0FBQyxDQUFDO1FBQ0YsZ0JBQWdCLENBQUMsaUJBQWlCLEdBQUcsVUFBUyxPQUFPLEVBQUMsYUFBYSxFQUFDLElBQUk7WUFDdkUsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1lBQ2hCLElBQUksS0FBSyxDQUFDO1lBQ1YsSUFBSSxNQUFNLENBQUM7WUFDWCxJQUFJLE9BQU8sQ0FBQztZQUNaLElBQUcsQ0FBQyxJQUFJLEVBQUU7Z0JBQ1QsT0FBTyxHQUFHLGFBQWEsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUN6RCxLQUFLLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztnQkFDdkIsTUFBTSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7YUFDekI7aUJBQU07Z0JBQ04sT0FBTyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUM7Z0JBQ2hDLEtBQUssR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO2dCQUN2QixNQUFNLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQzthQUN6QjtZQUNELElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztZQUNiLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNYLE9BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUU7Z0JBQzFCLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDekIsRUFBRSxFQUFFLENBQUM7Z0JBQ0wsQ0FBQyxHQUFHLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxJQUFJLHdCQUF3QixDQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsTUFBTSxDQUFDLEVBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ3RHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2FBQzdCO1lBQ0QsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUN2QixJQUFHLENBQUMsSUFBSSxFQUFFO2dCQUNULE1BQU0sR0FBRyxhQUFhLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUN6QyxPQUFPLElBQUksMEJBQTBCLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBQyxPQUFPLENBQUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQzlHOztnQkFBTSxPQUFPLElBQUksMEJBQTBCLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBQyxPQUFPLENBQUMsT0FBTyxFQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUMsUUFBUSxFQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RILENBQUMsQ0FBQztRQUNGLGdCQUFnQixDQUFDLHlCQUF5QixHQUFHLFVBQVMsS0FBSztZQUMxRCxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO1lBQzFCLElBQUksYUFBYSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUM7WUFDeEMsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztZQUN4QixJQUFJLFNBQVMsR0FBRyxpQkFBaUIsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM1RCxJQUFJLE9BQU8sR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQ3pCLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNYLE9BQU0sRUFBRSxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUU7Z0JBQzVCLElBQUksUUFBUSxHQUFHLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDN0IsRUFBRSxFQUFFLENBQUM7Z0JBQ0wsSUFBRyxRQUFRLENBQUMsSUFBSSxHQUFHLE9BQU8sRUFBRTtvQkFDM0IsSUFBSSxXQUFXLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLElBQUksRUFBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzNFLElBQUksR0FBRyxHQUFHLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxJQUFJLHdCQUF3QixDQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsYUFBYSxDQUFDLEVBQUMsV0FBVyxDQUFDLENBQUM7b0JBQ2pILEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO29CQUNsQixhQUFhLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQztpQkFDbEM7YUFDRDtZQUNELElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsT0FBTyxHQUFHLENBQUMsQ0FBQztZQUN6QyxJQUFJLGFBQWEsR0FBRyxPQUFPLEdBQUcsQ0FBQyxDQUFDO1lBQ2hDLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUNkLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNWLE9BQU0sQ0FBQyxHQUFHLGFBQWEsQ0FBQyxNQUFNLEVBQUU7Z0JBQy9CLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFDLENBQUMsR0FBRyxhQUFhLENBQUMsQ0FBQztnQkFDM0MsSUFBSSxHQUFHLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDO2dCQUM3QyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksd0JBQXdCLENBQUMsTUFBTSxFQUFDLEdBQUcsRUFBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUN4RCxDQUFDLElBQUksT0FBTyxDQUFDO2FBQ2I7WUFDRCxPQUFPLElBQUksQ0FBQztRQUNiLENBQUMsQ0FBQztRQUNGLGdCQUFnQixDQUFDLGVBQWUsR0FBRyxVQUFTLEtBQUssRUFBQyxhQUFhO1lBQzlELElBQUcsYUFBYSxDQUFDLE1BQU0sSUFBSSxDQUFDO2dCQUFFLE9BQU8sY0FBYyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN2RSxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO1lBQzFCLElBQUksYUFBYSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUM7WUFDeEMsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztZQUN4QixJQUFJLENBQUMsR0FBRyxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUNqQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUN2QixJQUFJLENBQUMsR0FBRyxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUNqQyxJQUFJLENBQUMsR0FBRyxjQUFjLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEVBQUMsS0FBSyxDQUFDLENBQUM7WUFDL0QsSUFBSSxDQUFDLEdBQUcsY0FBYyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxFQUFDLEtBQUssQ0FBQyxDQUFDO1lBQy9ELElBQUksa0JBQWtCLEdBQUcsRUFBRSxDQUFDO1lBQzVCLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQztZQUNwQixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDWixJQUFJLEVBQUUsR0FBRyxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUN4QixPQUFNLEdBQUcsR0FBRyxFQUFFLEVBQUU7Z0JBQ2YsSUFBSSxFQUFFLEdBQUcsR0FBRyxFQUFFLENBQUM7Z0JBQ2Ysa0JBQWtCLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQzNDO1lBQ0QsSUFBSSxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqQixJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hCLE9BQU0sSUFBSSxHQUFHLEdBQUcsRUFBRTtnQkFDakIsSUFBSSxFQUFFLEdBQUcsSUFBSSxFQUFFLENBQUM7Z0JBQ2hCLGtCQUFrQixDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQ25EO1lBQ0QsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQ2IsSUFBSSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNoQixPQUFNLElBQUksR0FBRyxHQUFHLEVBQUU7Z0JBQ2pCLElBQUksRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDO2dCQUNoQixVQUFVLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQzNCO1lBQ0QsSUFBSSxJQUFJLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQztZQUN0QixJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hCLE9BQU0sSUFBSSxHQUFHLEdBQUcsRUFBRTtnQkFDakIsSUFBSSxFQUFFLEdBQUcsSUFBSSxFQUFFLENBQUM7Z0JBQ2hCLFVBQVUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUNuQztZQUNELElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNWLE9BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDYixPQUFNLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDNUMsa0JBQWtCLENBQUMsQ0FBQyxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxhQUFhLENBQUMsQ0FBQyxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDbkUsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDekIsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ1YsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ1Y7Z0JBQ0Qsa0JBQWtCLENBQUMsQ0FBQyxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxrQkFBa0IsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUM7Z0JBQ3BFLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztnQkFDYixJQUFJLEdBQUcsR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDO2dCQUNyQixPQUFNLElBQUksR0FBRyxHQUFHLEVBQUU7b0JBQ2pCLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDO29CQUNmLElBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDO29CQUN6QixJQUFJLElBQUksR0FBRyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDaEQsSUFBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLG1CQUFtQixDQUFDLE9BQU87d0JBQUUsa0JBQWtCLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDO3lCQUFNO3dCQUM1RyxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUMxRCxrQkFBa0IsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksRUFBQyxrQkFBa0IsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLEVBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUMzSjtpQkFDRDtnQkFDRCxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDVixDQUFDLEVBQUUsQ0FBQzthQUNKO1lBQ0QsT0FBTyxJQUFJLHdCQUF3QixDQUFDLE1BQU0sRUFBQyxVQUFVLEVBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUMzRSxDQUFDLENBQUM7UUFDRixnQkFBZ0IsQ0FBQyxlQUFlLEdBQUcsVUFBUyxLQUFLLEVBQUMsQ0FBQyxFQUFDLENBQUM7WUFDcEQsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztZQUMxQixJQUFJLGFBQWEsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDO1lBQ3hDLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDeEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ1YsSUFBSSxPQUFPLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQztZQUNuQyxJQUFJLENBQUMsR0FBRyxjQUFjLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBQyxDQUFDLEVBQUMsS0FBSyxDQUFDLENBQUM7WUFDaEQsSUFBSSxZQUFZLEdBQUcsT0FBTyxHQUFHLENBQUMsQ0FBQztZQUMvQixJQUFJLGtCQUFrQixHQUFHLEVBQUUsQ0FBQztZQUM1QixJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7WUFDcEIsSUFBSSxrQkFBa0IsR0FBRyxFQUFFLENBQUM7WUFDNUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ1YsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQ1osSUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNmLE9BQU0sR0FBRyxHQUFHLEVBQUUsRUFBRTtnQkFDZixJQUFJLEVBQUUsR0FBRyxHQUFHLEVBQUUsQ0FBQztnQkFDZixVQUFVLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQzNCO1lBQ0QsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQ2IsSUFBSSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNoQixPQUFNLElBQUksR0FBRyxHQUFHLEVBQUU7Z0JBQ2pCLElBQUksRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDO2dCQUNoQixVQUFVLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUN2QjtZQUNELElBQUksSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDakIsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztZQUN2QixPQUFNLElBQUksR0FBRyxHQUFHLEVBQUU7Z0JBQ2pCLElBQUksRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDO2dCQUNoQixVQUFVLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUMvQjtZQUNELElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztZQUNiLElBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQ3pCLE9BQU0sSUFBSSxHQUFHLEdBQUcsRUFBRTtnQkFDakIsSUFBSSxFQUFFLEdBQUcsSUFBSSxFQUFFLENBQUM7Z0JBQ2hCLGtCQUFrQixDQUFDLEVBQUUsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUMzQztZQUNELElBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDaEIsT0FBTSxHQUFHLEdBQUcsT0FBTyxFQUFFO2dCQUNwQixJQUFJLEVBQUUsR0FBRyxHQUFHLEVBQUUsQ0FBQztnQkFDZixrQkFBa0IsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQy9DO1lBQ0QsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQ2IsSUFBSSxHQUFHLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDekIsT0FBTSxJQUFJLEdBQUcsR0FBRyxFQUFFO2dCQUNqQixJQUFJLEVBQUUsR0FBRyxJQUFJLEVBQUUsQ0FBQztnQkFDaEIsa0JBQWtCLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxDQUFDLENBQUMsR0FBRyxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUM7YUFDeEQ7WUFDRCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDVixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7WUFDZCxJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7WUFDYixJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hCLE9BQU0sSUFBSSxHQUFHLEdBQUcsRUFBRTtnQkFDakIsSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUM7Z0JBQ2YsQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDO2dCQUNuQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7Z0JBQ2IsSUFBSSxJQUFJLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM5QixPQUFNLElBQUksR0FBRyxJQUFJLEVBQUU7b0JBQ2xCLElBQUksRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDO29CQUNoQixLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUNsRSxrQkFBa0IsQ0FBQyxFQUFFLENBQUMsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFDLGtCQUFrQixDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssRUFBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3RKO2dCQUNELGtCQUFrQixDQUFDLENBQUMsQ0FBQyxHQUFHLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5QyxrQkFBa0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQ3ZFO1lBQ0QsSUFBSSxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqQixJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hCLE9BQU0sSUFBSSxHQUFHLEdBQUcsRUFBRTtnQkFDakIsSUFBSSxFQUFFLEdBQUcsSUFBSSxFQUFFLENBQUM7Z0JBQ2hCLGtCQUFrQixDQUFDLEVBQUUsQ0FBQyxHQUFHLGtCQUFrQixDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUNwRDtZQUNELE9BQU8sSUFBSSx3QkFBd0IsQ0FBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDM0UsQ0FBQyxDQUFDO1FBQ0YsSUFBSSxjQUFjLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsY0FBYSxDQUFDLENBQUM7UUFDNUQsVUFBVSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsY0FBYyxDQUFDO1FBQzlDLGNBQWMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2pELGNBQWMsQ0FBQywwQkFBMEIsR0FBRyxVQUFTLEtBQUssRUFBQyxVQUFVLEVBQUMsUUFBUTtZQUM3RSxPQUFPLGNBQWMsQ0FBQywrQkFBK0IsQ0FBQyxLQUFLLEVBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFDLFVBQVUsRUFBQyxRQUFRLENBQUMsQ0FBQztRQUM3SSxDQUFDLENBQUM7UUFDRixjQUFjLENBQUMsK0JBQStCLEdBQUcsVUFBUyxLQUFLLEVBQUMsS0FBSyxFQUFDLEdBQUcsRUFBQyxVQUFVLEVBQUMsUUFBUTtZQUM1RixJQUFHLFVBQVUsR0FBRyxDQUFDO2dCQUFFLFVBQVUsR0FBRyxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ1gsSUFBSSxJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDNUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ1YsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ1gsT0FBTSxFQUFFLEdBQUcsVUFBVSxFQUFFO2dCQUN0QixJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQztnQkFDYixDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUM7Z0JBQ3JCLElBQUcsUUFBUTtvQkFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztvQkFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNySTtZQUNELE9BQU8sQ0FBQyxDQUFDO1FBQ1YsQ0FBQyxDQUFDO1FBQ0YsY0FBYyxDQUFDLDJCQUEyQixHQUFHLFVBQVMsS0FBSyxFQUFDLEdBQUcsRUFBQyxRQUFRO1lBQ3ZFLElBQUcsUUFBUSxJQUFJLElBQUk7Z0JBQUUsUUFBUSxHQUFHLEtBQUssQ0FBQztZQUN0QyxJQUFHLEdBQUcsSUFBSSxJQUFJO2dCQUFFLEdBQUcsR0FBRyxJQUFJLENBQUM7WUFDM0IsSUFBRyxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtnQkFDckIsSUFBRyxDQUFDLFFBQVE7b0JBQUUsT0FBTyxLQUFLLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLENBQUM7cUJBQU07b0JBQy9FLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQztvQkFDWixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7b0JBQ1osSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUM7b0JBQ3JDLE9BQU0sR0FBRyxHQUFHLEdBQUcsRUFBRTt3QkFDaEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7d0JBQ2QsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDMUY7b0JBQ0QsT0FBTyxFQUFFLENBQUM7aUJBQ1Y7YUFDRDtZQUNELE9BQU8sY0FBYyxDQUFDLGdDQUFnQyxDQUFDLEtBQUssRUFBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUMsR0FBRyxFQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZJLENBQUMsQ0FBQztRQUNGLGNBQWMsQ0FBQyxnQ0FBZ0MsR0FBRyxVQUFTLEtBQUssRUFBQyxLQUFLLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxRQUFRO1lBQ3RGLElBQUksRUFBRSxHQUFHLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUMsS0FBSyxDQUFDLENBQUM7WUFDeEQsSUFBSSxFQUFFLEdBQUcsY0FBYyxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBQyxHQUFHLENBQUMsQ0FBQztZQUN0RCxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNsQyxJQUFJLEdBQUcsR0FBRyxLQUFLLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3BDLElBQUksRUFBRSxHQUFHLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUMsR0FBRyxDQUFDLENBQUM7WUFDdEQsSUFBSSxJQUFJLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsRUFBRSxDQUFDLENBQUM7WUFDcEMsSUFBSSxLQUFLLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsRUFBRSxDQUFDLENBQUM7WUFDckMsSUFBRyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksRUFBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNsSSxJQUFJLFNBQVMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDO2dCQUM1QyxJQUFJLFFBQVEsR0FBRyxjQUFjLENBQUMsZ0NBQWdDLENBQUMsS0FBSyxFQUFDLEtBQUssRUFBQyxTQUFTLEVBQUMsR0FBRyxFQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNuRyxJQUFJLFNBQVMsR0FBRyxjQUFjLENBQUMsZ0NBQWdDLENBQUMsS0FBSyxFQUFDLFNBQVMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNsRyxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQzlDO2lCQUFNLElBQUcsUUFBUTtnQkFBRSxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7Z0JBQU0sT0FBTyxDQUFDLEVBQUUsRUFBQyxFQUFFLENBQUMsQ0FBQztRQUN2RixDQUFDLENBQUM7UUFDRixjQUFjLENBQUMsb0JBQW9CLEdBQUcsVUFBUyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU07WUFDbkUsSUFBRyxNQUFNLEdBQUcsQ0FBQztnQkFBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQzFCLElBQUcsTUFBTSxHQUFHLENBQUM7Z0JBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUMxQixJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO1lBQzlCLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7WUFDOUIsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQztZQUMxQyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO1lBQzVCLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7WUFDNUIsSUFBSSxNQUFNLEdBQUcseUJBQXlCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoRSxJQUFJLE1BQU0sR0FBRyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hFLElBQUksTUFBTSxHQUFHLE1BQU0sR0FBRyxNQUFNLENBQUM7WUFDN0IsSUFBSSxNQUFNLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQztZQUM3QixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7WUFDaEIsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQ2IsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO1lBQ2pCLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNaLElBQUksRUFBRSxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFDcEIsT0FBTSxHQUFHLEdBQUcsRUFBRSxFQUFFO2dCQUNmLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO2dCQUNkLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztnQkFDWixJQUFJLEdBQUcsR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDO2dCQUNyQixPQUFNLEdBQUcsR0FBRyxHQUFHLEVBQUU7b0JBQ2hCLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO29CQUNkLElBQUksSUFBSSxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUM7b0JBQ3RCLElBQUksSUFBSSxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUM7b0JBQ3RCLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDdEIsSUFBSSxNQUFNLEdBQUcsY0FBYyxDQUFDLDBCQUEwQixDQUFDLE9BQU8sRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM1RSxJQUFJLEVBQUUsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3RCLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ2hCLElBQUksTUFBTSxHQUFHLGFBQWEsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdEYsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztpQkFDckI7YUFDRDtZQUNELElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUNmLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNaLE9BQU0sR0FBRyxHQUFHLE1BQU0sRUFBRTtnQkFDbkIsSUFBSSxFQUFFLEdBQUcsR0FBRyxFQUFFLENBQUM7Z0JBQ2YsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO2dCQUNiLE9BQU0sSUFBSSxHQUFHLE1BQU0sRUFBRTtvQkFDcEIsSUFBSSxFQUFFLEdBQUcsSUFBSSxFQUFFLENBQUM7b0JBQ2hCLElBQUksR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7b0JBQ2pDLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFDdkMsSUFBSSxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztvQkFDbEIsSUFBSSxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztvQkFDbEIsSUFBSSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUN4QixJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3hCLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ2hCLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ2hCO2FBQ0Q7WUFDRCxPQUFPLElBQUksa0JBQWtCLENBQUMsS0FBSyxFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsR0FBRyxDQUFDLENBQUM7UUFDekQsQ0FBQyxDQUFDO1FBQ0YsY0FBYyxDQUFDLDZCQUE2QixHQUFHLFVBQVMsT0FBTyxFQUFDLE9BQU87WUFDdEUsSUFBRyxPQUFPLElBQUksSUFBSTtnQkFBRSxPQUFPLEdBQUcsSUFBSSxtQ0FBbUMsRUFBRSxDQUFDO1lBQ3hFLElBQUcsT0FBTyxDQUFDLFFBQVEsSUFBSSxJQUFJO2dCQUFFLE9BQU8sQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQzs7Z0JBQU0sT0FBTyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7WUFDNUYsSUFBRyxPQUFPLENBQUMsUUFBUSxJQUFJLElBQUk7Z0JBQUUsT0FBTyxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDOztnQkFBTSxPQUFPLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztZQUM1RixJQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksSUFBSTtnQkFBRSxPQUFPLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7O2dCQUFNLE9BQU8sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1lBQ3ZGLElBQUksSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2xELElBQUksSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3JELElBQUksS0FBSyxDQUFDO1lBQ1YsSUFBRyxPQUFPLENBQUMsUUFBUSxHQUFHLElBQUk7Z0JBQUUsS0FBSyxHQUFHLE9BQU8sQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQzs7Z0JBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1lBQzlHLElBQUksS0FBSyxDQUFDO1lBQ1YsSUFBRyxPQUFPLENBQUMsUUFBUSxHQUFHLElBQUk7Z0JBQUUsS0FBSyxHQUFHLE9BQU8sQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQzs7Z0JBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1lBQzlHLElBQUksSUFBSSxHQUFHLHlCQUF5QixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDMUQsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QixJQUFJLElBQUksR0FBRyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzFELElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDO1lBQy9CLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUMvQixJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7WUFDZCxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7WUFDYixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDWixJQUFJLEVBQUUsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQ25CLE9BQU0sR0FBRyxHQUFHLEVBQUUsRUFBRTtnQkFDZixJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztnQkFDZCxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7Z0JBQ2YsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUNaLElBQUksR0FBRyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7Z0JBQ3BCLE9BQU0sR0FBRyxHQUFHLEdBQUcsRUFBRTtvQkFDaEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7b0JBQ2QsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ3RCLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUN0QixJQUFJLEVBQUUsR0FBRyxjQUFjLENBQUMsMEJBQTBCLENBQUMsT0FBTyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2xFLElBQUksSUFBSSxHQUFHLGFBQWEsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDNUUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLHNCQUFzQixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQzFGO2dCQUNELEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDaEI7WUFDRCxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDWixPQUFNLEdBQUcsR0FBRyxLQUFLLEVBQUU7Z0JBQ2xCLElBQUksRUFBRSxHQUFHLEdBQUcsRUFBRSxDQUFDO2dCQUNmLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztnQkFDYixPQUFNLElBQUksR0FBRyxLQUFLLEVBQUU7b0JBQ25CLElBQUksRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDO29CQUNoQixJQUFJLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBQyxHQUFHLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBQyxHQUFHLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ2hILElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxnQ0FBZ0MsQ0FBQyxPQUFPLEVBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztpQkFDakU7YUFDRDtZQUNELElBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTTtnQkFBRSxPQUFPLElBQUksQ0FBQztZQUNoQyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDWixPQUFNLEdBQUcsR0FBRyxLQUFLLEVBQUU7Z0JBQ2xCLElBQUksRUFBRSxHQUFHLEdBQUcsRUFBRSxDQUFDO2dCQUNmLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztnQkFDYixPQUFNLElBQUksR0FBRyxLQUFLLEVBQUU7b0JBQ25CLElBQUksRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDO29CQUNoQixJQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsS0FBSyxHQUFHLEVBQUUsQ0FBQztvQkFDekIsSUFBSSxDQUFDLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUMsS0FBSyxFQUFDLElBQUksQ0FBQyxDQUFDO29CQUN4RCxJQUFJLENBQUMsR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEtBQUssRUFBQyxLQUFLLEVBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3ZELElBQUksQ0FBQyxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsS0FBSyxFQUFDLEtBQUssRUFBQyxJQUFJLENBQUMsQ0FBQztvQkFDeEQsSUFBSSxDQUFDLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUMsS0FBSyxFQUFDLElBQUksQ0FBQyxDQUFDO29CQUN2RCxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQy9CLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQ3pCO2FBQ0Q7WUFDRCxPQUFPLElBQUksQ0FBQztRQUNiLENBQUMsQ0FBQztRQUNGLGNBQWMsQ0FBQyxLQUFLLEdBQUcsVUFBUyxLQUFLLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxLQUFLLEVBQUMsS0FBSyxFQUFDLElBQUk7WUFDekQsSUFBRyxDQUFDLElBQUksQ0FBQztnQkFBRSxPQUFPLElBQUksQ0FBQztZQUN2QixPQUFPLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFDO1FBQ0YsY0FBYyxDQUFDLEtBQUssR0FBRyxVQUFTLEtBQUssRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLEtBQUssRUFBQyxLQUFLLEVBQUMsSUFBSTtZQUN6RCxJQUFHLENBQUMsSUFBSSxLQUFLLEdBQUcsQ0FBQztnQkFBRSxPQUFPLElBQUksQ0FBQztZQUMvQixPQUFPLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFDO1FBQ0YsY0FBYyxDQUFDLElBQUksR0FBRyxVQUFTLEtBQUssRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLEtBQUssRUFBQyxLQUFLLEVBQUMsSUFBSTtZQUN4RCxJQUFHLENBQUMsSUFBSSxLQUFLLEdBQUcsQ0FBQztnQkFBRSxPQUFPLElBQUksQ0FBQztZQUMvQixPQUFPLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDeEIsQ0FBQyxDQUFDO1FBQ0YsY0FBYyxDQUFDLElBQUksR0FBRyxVQUFTLEtBQUssRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLEtBQUssRUFBQyxLQUFLLEVBQUMsSUFBSTtZQUN4RCxJQUFHLENBQUMsSUFBSSxDQUFDO2dCQUFFLE9BQU8sSUFBSSxDQUFDO1lBQ3ZCLE9BQU8sSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN4QixDQUFDLENBQUM7UUFDRixjQUFjLENBQUMscUNBQXFDLEdBQUcsVUFBUyxPQUFPO1lBQ3RFLElBQUksSUFBSSxHQUFHLGtCQUFrQixDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3RDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNYLE9BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUU7Z0JBQzFCLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDcEIsRUFBRSxFQUFFLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNwQjtZQUNELE9BQU8sSUFBSSxDQUFDO1FBQ2IsQ0FBQyxDQUFDO1FBQ0YsY0FBYyxDQUFDLHVCQUF1QixHQUFHLFVBQVMsT0FBTyxFQUFDLE9BQU87WUFDaEUsSUFBRyxPQUFPLElBQUksSUFBSTtnQkFBRSxPQUFPLEdBQUcsT0FBTyxDQUFDOztnQkFBTSxPQUFPLEdBQUcsSUFBSSxtQ0FBbUMsRUFBRSxDQUFDO1lBQ2hHLElBQUksUUFBUSxHQUFHLGNBQWMsQ0FBQyw2QkFBNkIsQ0FBQyxPQUFPLEVBQUMsT0FBTyxDQUFDLENBQUM7WUFDN0UsT0FBTyxjQUFjLENBQUMscUNBQXFDLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdkUsQ0FBQyxDQUFDO1FBQ0YsSUFBSSxtQ0FBbUMsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLHlCQUF5QixHQUFHO1lBQ3RGLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1lBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1lBQ2xCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1lBQ25CLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQ25CLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1lBQ2xCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3ZCLENBQUMsQ0FBQztRQUNGLFVBQVUsQ0FBQyxxQ0FBcUMsQ0FBQyxHQUFHLG1DQUFtQyxDQUFDO1FBQ3hGLG1DQUFtQyxDQUFDLFFBQVEsR0FBRyxDQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsMkJBQTJCLENBQUMsQ0FBQztRQUMzRixtQ0FBbUMsQ0FBQyxTQUFTLEdBQUc7WUFDL0MsU0FBUyxFQUFFLG1DQUFtQztTQUM5QyxDQUFDO1FBQ0YsSUFBSSxnQ0FBZ0MsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLHNCQUFzQixHQUFHLFVBQVMsR0FBRyxFQUFDLE9BQU8sRUFBQyxTQUFTO1lBQzlHLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1lBQ2YsSUFBRyxTQUFTLElBQUksSUFBSTtnQkFBRSxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLENBQUM7O2dCQUFNLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1lBQzlGLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1lBQ3ZCLElBQUcsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLEVBQUU7Z0JBQ3hCLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLElBQUksRUFBRSxHQUFHLHlCQUF5QixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3BELElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLElBQUksRUFBRSxHQUFHLHlCQUF5QixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3BELElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQyxFQUFDLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUMsRUFBRSxDQUFDLEVBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBQyxFQUFFLENBQUMsRUFBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDcks7UUFDRixDQUFDLENBQUM7UUFDRixVQUFVLENBQUMsa0NBQWtDLENBQUMsR0FBRyxnQ0FBZ0MsQ0FBQztRQUNsRixnQ0FBZ0MsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDckYsZ0NBQWdDLENBQUMsU0FBUyxHQUFHO1lBQzVDLE1BQU0sRUFBRTtnQkFDUCxPQUFPLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDO1lBQzlCLENBQUM7WUFDQSxNQUFNLEVBQUU7Z0JBQ1IsSUFBRyxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUk7b0JBQUUsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDOztvQkFBTSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkcsQ0FBQztZQUNBLFdBQVcsRUFBRTtnQkFDYixJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQy9ELElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDL0QsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUNYLE9BQU0sRUFBRSxHQUFHLENBQUMsRUFBRTtvQkFDYixJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQztvQkFDYixJQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLElBQUksRUFBRTt3QkFDakMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDeEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ2hDO2lCQUNEO1lBQ0YsQ0FBQztZQUNBLE9BQU8sRUFBRSxVQUFTLENBQUMsRUFBQyxDQUFDLEVBQUMsS0FBSztnQkFDM0IsSUFBSSxNQUFNLEdBQUcsY0FBYyxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkUsSUFBSSxFQUFFLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixJQUFJLElBQUksR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDMUQsSUFBSSxLQUFLLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdkMsSUFBRyxDQUFDLEtBQUs7b0JBQUUsSUFBSSxHQUFHLGFBQWEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2pELElBQUcsS0FBSyxJQUFJLElBQUksRUFBRTtvQkFDakIsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7b0JBQ3BCLEtBQUssQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO29CQUNqQixLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztvQkFDcEIsT0FBTyxLQUFLLENBQUM7aUJBQ2I7O29CQUFNLE9BQU8sSUFBSSxzQkFBc0IsQ0FBQyxFQUFFLEVBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2xFLENBQUM7WUFDQSxjQUFjLEVBQUUsVUFBUyxTQUFTO2dCQUNsQyxJQUFHLElBQUksQ0FBQyxNQUFNLEVBQUU7b0JBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDbkQsSUFBRyxJQUFJLENBQUMsVUFBVTtvQkFBRSxRQUFPLFNBQVMsRUFBRTt3QkFDdEMsS0FBSyxDQUFDOzRCQUNMLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzNDLEtBQUssQ0FBQzs0QkFDTCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN0RixLQUFLLENBQUM7NEJBQ0wsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDM0MsS0FBSyxDQUFDOzRCQUNMLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3JGO2dCQUNELFFBQU8sU0FBUyxFQUFFO29CQUNsQixLQUFLLENBQUM7d0JBQ0wsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdEYsS0FBSyxDQUFDO3dCQUNMLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzNDLEtBQUssQ0FBQzt3QkFDTCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN0RixLQUFLLENBQUM7d0JBQ0wsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDMUM7Z0JBQ0QsT0FBTyxJQUFJLENBQUM7WUFDYixDQUFDO1lBQ0EsYUFBYSxFQUFFLFVBQVMsU0FBUztnQkFDakMsSUFBSSxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hDLElBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxJQUFJO29CQUFFLE9BQU8sT0FBTyxDQUFDO2dCQUNyRCxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDNUUsSUFBSSxTQUFTLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQztnQkFDOUIsSUFBSSxDQUFDLEdBQUcsbUJBQW1CLENBQUMsT0FBTyxDQUFDO2dCQUNwQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7Z0JBQ2hCLElBQUksWUFBWSxHQUFHLENBQUMsVUFBUyxDQUFDO3dCQUM3QixPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNuRixDQUFDLEVBQUMsVUFBUyxFQUFFO3dCQUNaLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3JGLENBQUMsQ0FBQyxDQUFDO2dCQUNILElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pELFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDckIsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ25DLENBQUM7WUFDQSxRQUFRLEVBQUUsVUFBUyxLQUFLO2dCQUN4QixJQUFHLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSTtvQkFBRSxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2xFLElBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDO29CQUFFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDbEUsUUFBTyxLQUFLLEVBQUU7b0JBQ2QsS0FBSyxDQUFDO3dCQUNMLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2pFLE1BQU07b0JBQ1AsS0FBSyxDQUFDO3dCQUNMLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ2pFLE1BQU07b0JBQ1AsS0FBSyxDQUFDO3dCQUNMLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2pFLE1BQU07b0JBQ1AsS0FBSyxDQUFDO3dCQUNMLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ2pFLE1BQU07aUJBQ047Z0JBQ0QsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzlCLENBQUM7WUFDQSxhQUFhLEVBQUU7Z0JBQ2YsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUN6RyxDQUFDO1lBQ0EsVUFBVSxFQUFFO2dCQUNaLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO2dCQUM1QixJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ1gsT0FBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFO29CQUNiLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDO29CQUNiLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzNCLElBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUU7d0JBQ3pCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ25DLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ25DLElBQUcsRUFBRSxDQUFDLEtBQUs7NEJBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQzs7NEJBQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQztxQkFDekY7aUJBQ0Q7WUFDRixDQUFDO1lBQ0EsWUFBWSxFQUFFLFVBQVMsT0FBTyxFQUFDLFlBQVk7Z0JBQzNDLElBQUcsWUFBWSxHQUFHLE9BQU8sQ0FBQyxRQUFRO29CQUFFLE9BQU8sSUFBSSxDQUFDO2dCQUNoRCxJQUFHLFlBQVksSUFBSSxPQUFPLENBQUMsUUFBUTtvQkFBRSxPQUFPLEtBQUssQ0FBQztnQkFDbEQsSUFBRyxJQUFJLENBQUMsYUFBYSxFQUFFLEVBQUU7b0JBQ3hCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztvQkFDbEIsT0FBTyxLQUFLLENBQUM7aUJBQ2I7Z0JBQ0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxhQUFhLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxPQUFPLElBQUksYUFBYSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO2dCQUNoUCxJQUFJLENBQUMsVUFBVSxHQUFHLGFBQWEsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLE9BQU8sSUFBSSxhQUFhLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7Z0JBQ2pQLElBQUcsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsVUFBVTtvQkFBRSxPQUFPLElBQUksQ0FBQztnQkFDbEQsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUMzQixPQUFPLGFBQWEsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsT0FBTyxJQUFJLGFBQWEsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsT0FBTyxJQUFJLGFBQWEsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsT0FBTyxJQUFJLGFBQWEsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO1lBQ3JhLENBQUM7WUFDQSxNQUFNLEVBQUUsVUFBUyxPQUFPO2dCQUN4QixJQUFHLE9BQU8sSUFBSSxJQUFJO29CQUFFLE9BQU8sR0FBRyxJQUFJLG1DQUFtQyxFQUFFLENBQUM7Z0JBQ3hFLElBQUcsT0FBTyxDQUFDLE9BQU8sSUFBSSxJQUFJO29CQUFFLE9BQU8sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO2dCQUNyRCxJQUFHLE9BQU8sQ0FBQyxRQUFRLElBQUksSUFBSTtvQkFBRSxPQUFPLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztnQkFDbEQsSUFBRyxPQUFPLENBQUMsUUFBUSxJQUFJLElBQUk7b0JBQUUsT0FBTyxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7Z0JBQ25ELElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFDLENBQUMsRUFBQyxJQUFJLENBQUMsQ0FBQztZQUM5QixDQUFDO1lBQ0EsT0FBTyxFQUFFLFVBQVMsT0FBTyxFQUFDLFlBQVksRUFBQyxLQUFLO2dCQUM1QyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQ25CLElBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBQyxZQUFZLENBQUM7b0JBQUUsT0FBTztnQkFDcEQsWUFBWSxFQUFFLENBQUM7Z0JBQ2YsSUFBRyxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVU7b0JBQUUsS0FBSyxHQUFHLEtBQUssQ0FBQztxQkFBTSxJQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsVUFBVTtvQkFBRSxLQUFLLEdBQUcsSUFBSSxDQUFDO2dCQUMvRyxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztnQkFDeEIsSUFBRyxJQUFJLENBQUMsVUFBVSxFQUFFO29CQUNuQixJQUFJLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDL0UsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzlFLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxJQUFJLGdDQUFnQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUMsSUFBSSxDQUFDLEVBQUMsSUFBSSxnQ0FBZ0MsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ3pILElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN0RyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDdEc7cUJBQU07b0JBQ04sSUFBSSxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQy9FLElBQUksS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNoRixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxnQ0FBZ0MsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFDLElBQUksQ0FBQyxFQUFDLElBQUksZ0NBQWdDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUMzSCxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdEcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3RHO2dCQUNELElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDWCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUN4QixPQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFO29CQUN0QixJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ3BCLEVBQUUsRUFBRSxDQUFDO29CQUNMLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFDLFlBQVksRUFBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUMzQztZQUNGLENBQUM7WUFDQSxXQUFXLEVBQUUsVUFBUyxJQUFJO2dCQUMxQixJQUFHLElBQUksSUFBSSxJQUFJO29CQUFFLElBQUksR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDbkQsSUFBRyxJQUFJLENBQUMsTUFBTSxFQUFFO29CQUFFLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDcEQsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUNYLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7Z0JBQ3hCLE9BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUU7b0JBQ3RCLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDaEIsRUFBRSxFQUFFLENBQUM7b0JBQ0wsSUFBRyxDQUFDLElBQUksSUFBSTt3QkFBRSxNQUFNO29CQUNwQixDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNwQjtnQkFDRCxPQUFPLElBQUksQ0FBQztZQUNiLENBQUM7WUFDQSxlQUFlLEVBQUUsVUFBUyxJQUFJO2dCQUM5QixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztnQkFDbkMsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO2dCQUNiLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztnQkFDYixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7Z0JBQ2hCLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDWCxPQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUU7b0JBQ2IsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUM7b0JBQ2QsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDekMsSUFBRyxXQUFXLENBQUMsTUFBTSxJQUFJLENBQUM7d0JBQUUsT0FBTyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQzdDLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztvQkFDWixJQUFJLEdBQUcsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO29CQUM3QixPQUFNLEdBQUcsR0FBRyxHQUFHLEVBQUU7d0JBQ2hCLElBQUksRUFBRSxHQUFHLEdBQUcsRUFBRSxDQUFDO3dCQUNmLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7cUJBQzFCO2lCQUNEO2dCQUNELElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztnQkFDWixPQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFO29CQUN2QixJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3RCLEVBQUUsR0FBRyxDQUFDO29CQUNOLElBQUcsTUFBTSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRTt3QkFDbkIsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQ3BCLFNBQVM7cUJBQ1Q7b0JBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUN6QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQy9CLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDakMsTUFBTSxDQUFDLEVBQUUsR0FBRyxTQUFTLENBQUM7b0JBQ3RCLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQ3BCLFNBQVMsRUFBRSxDQUFDO2lCQUNaO2dCQUNELElBQUcsR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7b0JBQ25CLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN4QyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDeEMsT0FBTyxJQUFJLENBQUM7aUJBQ1o7cUJBQU0sSUFBRyxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtvQkFDMUIsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztvQkFDcEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2hGLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNoRixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDaEYsT0FBTyxJQUFJLENBQUM7aUJBQ1o7Z0JBQ0QsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUMzQixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ3pCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDL0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNqQyxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7Z0JBQ3pDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDVixJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztnQkFDdkIsT0FBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRTtvQkFDckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzdDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztpQkFDUjtnQkFDRCxPQUFPLElBQUksQ0FBQztZQUNiLENBQUM7WUFDQSxTQUFTLEVBQUUsZ0NBQWdDO1NBQzVDLENBQUM7UUFDRixJQUFJLG1CQUFtQixHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLGNBQWEsQ0FBQyxDQUFDO1FBQ3RFLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLG1CQUFtQixDQUFDO1FBQ3hELG1CQUFtQixDQUFDLFFBQVEsR0FBRyxDQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsWUFBWSxDQUFDLENBQUM7UUFDM0QsbUJBQW1CLENBQUMsSUFBSSxHQUFHO1lBQzFCLElBQUcsbUJBQW1CLENBQUMsS0FBSztnQkFBRSxPQUFPO1lBQ3JDLG1CQUFtQixDQUFDLFdBQVcsR0FBRyxJQUFJLG1CQUFtQixDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3ZGLG1CQUFtQixDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEMsQ0FBQyxDQUFDO1FBQ0YsbUJBQW1CLENBQUMsY0FBYyxHQUFHLFVBQVMsU0FBUyxFQUFDLFVBQVUsRUFBQyxJQUFJO1lBQ3RFLG1CQUFtQixDQUFDLElBQUksRUFBRSxDQUFDO1lBQzNCLElBQUksR0FBRyxHQUFHLElBQUksZUFBZSxFQUFFLENBQUM7WUFDaEMsSUFBSSxRQUFRLEdBQUcsVUFBUyxDQUFDO2dCQUN4QixHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLENBQUMsQ0FBQztZQUNGLG1CQUFtQixDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsRUFBQyxVQUFVLEVBQUMsSUFBSSxFQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQy9GLE9BQU8sSUFBSSxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFDO1FBQ0YsSUFBSSxtQkFBbUIsR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxVQUFTLFVBQVUsRUFBQyxRQUFRO1lBQ2xGLElBQUcsUUFBUSxJQUFJLElBQUk7Z0JBQUUsUUFBUSxHQUFHLFNBQVMsQ0FBQztZQUMxQyxJQUFHLFVBQVUsSUFBSSxJQUFJO2dCQUFFLFVBQVUsR0FBRyxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztZQUNyQyxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUNoQixJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztZQUNqQixJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDWCxPQUFNLEVBQUUsR0FBRyxVQUFVLEVBQUU7Z0JBQ3RCLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDO2dCQUNiLElBQUksQ0FBQyxDQUFDO2dCQUNOLElBQUk7b0JBQ0gsQ0FBQyxHQUFHLElBQUksTUFBTSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsQ0FBQztpQkFDeEQ7Z0JBQUMsT0FBTyxDQUFDLEVBQUc7b0JBQ1osSUFBSSxDQUFDLFlBQVksbUJBQW1CO3dCQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDO29CQUNoRCxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsbUJBQW1CLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUM7aUJBQ3BGO2dCQUNELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ25CO1FBQ0YsQ0FBQyxDQUFDO1FBQ0YsVUFBVSxDQUFDLHFCQUFxQixDQUFDLEdBQUcsbUJBQW1CLENBQUM7UUFDeEQsbUJBQW1CLENBQUMsUUFBUSxHQUFHLENBQUMsTUFBTSxFQUFDLEtBQUssRUFBQyxZQUFZLENBQUMsQ0FBQztRQUMzRCxtQkFBbUIsQ0FBQyxTQUFTLEdBQUc7WUFDL0IsT0FBTyxFQUFFLFVBQVMsU0FBUyxFQUFDLFVBQVUsRUFBQyxJQUFJLEVBQUMsUUFBUTtnQkFDbkQsSUFBSSxJQUFJLEdBQUcsSUFBSSwwQkFBMEIsQ0FBQyxTQUFTLEVBQUMsVUFBVSxFQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNyRSxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN0QyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3JCLENBQUM7WUFDQSxZQUFZLEVBQUU7Z0JBQ2QsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDO2dCQUNkLE9BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtvQkFDdEQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFDL0IsSUFBSSxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ3ZCLElBQUksTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO29CQUNsQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxVQUFTLE1BQU0sRUFBQyxNQUFNO3dCQUM1QyxPQUFPLFVBQVMsQ0FBQzs0QkFDaEIsRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQzlCLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUN6QixJQUFJO2dDQUNILElBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO29DQUM3QyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO29DQUMxQyxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQ0FDaEM7NkJBQ0Q7NEJBQUMsT0FBTyxLQUFLLEVBQUc7Z0NBQ2hCLElBQUksS0FBSyxZQUFZLG1CQUFtQjtvQ0FBRSxLQUFLLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQztnQ0FDNUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQzs2QkFDbkI7NEJBQ0QsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO3dCQUNuQixDQUFDLENBQUM7b0JBQ0gsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUNsQixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUM1QjtZQUNGLENBQUM7WUFDQSxTQUFTLEVBQUUsbUJBQW1CO1NBQy9CLENBQUM7UUFDRixJQUFJLDBCQUEwQixHQUFHLFVBQVMsU0FBUyxFQUFDLFVBQVUsRUFBQyxJQUFJO1lBQ2xFLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1lBQzNCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1lBQzdCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxFQUFFLEdBQUcsMEJBQTBCLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDN0MsQ0FBQyxDQUFDO1FBQ0YsVUFBVSxDQUFDLDJCQUEyQixDQUFDLEdBQUcsMEJBQTBCLENBQUM7UUFDckUsMEJBQTBCLENBQUMsUUFBUSxHQUFHLENBQUMsTUFBTSxFQUFDLEtBQUssRUFBQyxhQUFhLEVBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUUsMEJBQTBCLENBQUMsU0FBUyxHQUFHO1lBQ3RDLFNBQVMsRUFBRSwwQkFBMEI7U0FDckMsQ0FBQztRQUNGLElBQUksZ0JBQWdCLEdBQUcsY0FBYSxDQUFDLENBQUM7UUFDdEMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsZ0JBQWdCLENBQUM7UUFDbEQsZ0JBQWdCLENBQUMsUUFBUSxHQUFHLENBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxRQUFRLENBQUMsQ0FBQztRQUNyRCxnQkFBZ0IsQ0FBQyxjQUFjLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQzVELGdCQUFnQixDQUFDLFNBQVMsR0FBRztZQUM1QixTQUFTLEVBQUUsZ0JBQWdCO1NBQzNCLENBQUM7UUFDRixJQUFJLG9CQUFvQixHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVMsSUFBSTtZQUNyRSxJQUFJLENBQUMsS0FBSyxHQUFHLGVBQWUsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxRCxDQUFDLENBQUM7UUFDRixVQUFVLENBQUMsc0JBQXNCLENBQUMsR0FBRyxvQkFBb0IsQ0FBQztRQUMxRCxvQkFBb0IsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzdELG9CQUFvQixDQUFDLGNBQWMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDekQsb0JBQW9CLENBQUMsMkJBQTJCLEdBQUcsVUFBUyxNQUFNLEVBQUMsS0FBSyxFQUFDLGFBQWEsRUFBQyxPQUFPO1lBQzdGLE9BQU8sSUFBSSxvQkFBb0IsQ0FBQyxJQUFJLHdCQUF3QixDQUFDLE1BQU0sRUFBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hJLENBQUMsQ0FBQztRQUNGLG9CQUFvQixDQUFDLFFBQVEsR0FBRyxVQUFTLE1BQU0sRUFBQyxNQUFNO1lBQ3JELElBQUcsTUFBTSxJQUFJLElBQUk7Z0JBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUM5QixPQUFPLElBQUksb0JBQW9CLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLE1BQU0sRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3BGLENBQUMsQ0FBQztRQUNGLG9CQUFvQixDQUFDLFNBQVMsR0FBRywwQkFBMEIsQ0FBQztRQUM1RCxvQkFBb0IsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLDBCQUEwQixDQUFDLFNBQVMsRUFBQztZQUM3RSxNQUFNLEVBQUU7Z0JBQ1AsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztZQUMxQixDQUFDO1lBQ0EsS0FBSyxFQUFFO2dCQUNQLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLENBQUM7WUFDQSxhQUFhLEVBQUU7Z0JBQ2YsT0FBTyxjQUFjLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDaEUsQ0FBQztZQUNBLE9BQU8sRUFBRTtnQkFDVCxPQUFPLGNBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUMxRCxDQUFDO1lBQ0EsT0FBTyxFQUFFO2dCQUNULE9BQU8sSUFBSSx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbEksQ0FBQztZQUNBLEtBQUssRUFBRTtnQkFDUCxPQUFPLElBQUksb0JBQW9CLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzdDLENBQUM7WUFDQSxNQUFNLEVBQUU7Z0JBQ1IsT0FBTyxJQUFJLGtCQUFrQixDQUFDLHlCQUF5QixDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDbkksQ0FBQztZQUNBLFNBQVMsRUFBRSxVQUFTLEdBQUc7Z0JBQ3ZCLE9BQU8sSUFBSSxvQkFBb0IsQ0FBQyxnQkFBZ0IsQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDMUYsQ0FBQztZQUNBLGNBQWMsRUFBRSxVQUFTLEdBQUc7Z0JBQzVCLE9BQU8sbUJBQW1CLENBQUMsY0FBYyxDQUFDLGdCQUFnQixFQUFDLHdCQUF3QixFQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFTLENBQUM7b0JBQ3BILE9BQU8sSUFBSSxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEMsQ0FBQyxDQUFDLENBQUM7WUFDSixDQUFDO1lBQ0EsS0FBSyxFQUFFLFVBQVMsQ0FBQztnQkFDakIsT0FBTyxjQUFjLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBQyxDQUFDLENBQUMsQ0FBQztZQUN4RCxDQUFDO1lBQ0EsVUFBVSxFQUFFLFVBQVMsQ0FBQztnQkFDdEIsT0FBTyxtQkFBbUIsQ0FBQyxjQUFjLENBQUMsY0FBYyxFQUFDLG9CQUFvQixFQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9GLENBQUM7WUFDQSxPQUFPLEVBQUUsVUFBUyxDQUFDO2dCQUNuQixPQUFPLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFELENBQUM7WUFDQSxZQUFZLEVBQUUsVUFBUyxDQUFDO2dCQUN4QixPQUFPLG1CQUFtQixDQUFDLGNBQWMsQ0FBQyxjQUFjLEVBQUMsc0JBQXNCLEVBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakcsQ0FBQztZQUNBLFdBQVcsRUFBRSxVQUFTLENBQUMsRUFBQyxTQUFTO2dCQUNqQyxJQUFHLFNBQVMsSUFBSSxJQUFJO29CQUFFLFNBQVMsR0FBRyxDQUFDLENBQUM7Z0JBQ3BDLE9BQU8sY0FBYyxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUMsQ0FBQyxFQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3hFLENBQUM7WUFDQSxnQkFBZ0IsRUFBRSxVQUFTLENBQUMsRUFBQyxTQUFTO2dCQUN0QyxJQUFHLFNBQVMsSUFBSSxJQUFJO29CQUFFLFNBQVMsR0FBRyxDQUFDLENBQUM7Z0JBQ3BDLE9BQU8sbUJBQW1CLENBQUMsY0FBYyxDQUFDLGNBQWMsRUFBQywwQkFBMEIsRUFBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUMsQ0FBQyxFQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDL0csQ0FBQztZQUNBLFlBQVksRUFBRSxVQUFTLEVBQUU7Z0JBQ3pCLE9BQU8saUJBQWlCLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBQyxFQUFFLENBQUMsQ0FBQztZQUNuRSxDQUFDO1lBQ0EsaUJBQWlCLEVBQUUsVUFBUyxFQUFFO2dCQUM5QixPQUFPLG1CQUFtQixDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsRUFBQywyQkFBMkIsRUFBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMxRyxDQUFDO1lBQ0EsWUFBWSxFQUFFLFVBQVMsRUFBRTtnQkFDekIsT0FBTyxpQkFBaUIsQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ25FLENBQUM7WUFDQSxpQkFBaUIsRUFBRSxVQUFTLEVBQUU7Z0JBQzlCLE9BQU8sbUJBQW1CLENBQUMsY0FBYyxDQUFDLGlCQUFpQixFQUFDLDJCQUEyQixFQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzFHLENBQUM7WUFDQSxNQUFNLEVBQUU7Z0JBQ1IsT0FBTyxpQkFBaUIsQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDN0QsQ0FBQztZQUNBLFdBQVcsRUFBRTtnQkFDYixPQUFPLG1CQUFtQixDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsRUFBQyx3QkFBd0IsRUFBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3BHLENBQUM7WUFDQSxhQUFhLEVBQUUsVUFBUyxDQUFDO2dCQUN6QixPQUFPLGlCQUFpQixDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0QsQ0FBQztZQUNBLGtCQUFrQixFQUFFO2dCQUNwQixPQUFPLG1CQUFtQixDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsRUFBQyx3QkFBd0IsRUFBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3BHLENBQUM7WUFDQSxhQUFhLEVBQUUsVUFBUyxHQUFHLEVBQUMsU0FBUztnQkFDckMsT0FBTyxpQkFBaUIsQ0FBQyw2QkFBNkIsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFDLEdBQUcsRUFBQyxTQUFTLENBQUMsQ0FBQztZQUNsRixDQUFDO1lBQ0Esa0JBQWtCLEVBQUUsVUFBUyxHQUFHLEVBQUMsU0FBUztnQkFDMUMsT0FBTyxtQkFBbUIsQ0FBQyxjQUFjLENBQUMsaUJBQWlCLEVBQUMsK0JBQStCLEVBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFDLEdBQUcsRUFBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3pILENBQUM7WUFDQSxzQkFBc0IsRUFBRSxVQUFTLFNBQVM7Z0JBQzFDLE9BQU8sZ0JBQWdCLENBQUMsNkJBQTZCLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBQyxTQUFTLENBQUMsQ0FBQztZQUM3RSxDQUFDO1lBQ0EsMkJBQTJCLEVBQUUsVUFBUyxTQUFTO2dCQUMvQyxPQUFPLG1CQUFtQixDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsRUFBQywrQkFBK0IsRUFBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNwSCxDQUFDO1lBQ0EsaUJBQWlCLEVBQUUsVUFBUyxTQUFTO2dCQUNyQyxPQUFPLGdCQUFnQixDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUMsU0FBUyxDQUFDLENBQUM7WUFDeEUsQ0FBQztZQUNBLHNCQUFzQixFQUFFLFVBQVMsU0FBUztnQkFDMUMsT0FBTyxtQkFBbUIsQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLEVBQUMsMEJBQTBCLEVBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDL0csQ0FBQztZQUNBLEtBQUssRUFBRSxVQUFTLENBQUM7Z0JBQ2pCLE9BQU8sZ0JBQWdCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVMsQ0FBQztvQkFDOUQsT0FBTyxJQUFJLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwQyxDQUFDLENBQUMsQ0FBQztZQUNKLENBQUM7WUFDQSxVQUFVLEVBQUUsVUFBUyxDQUFDO2dCQUN0QixPQUFPLG1CQUFtQixDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsRUFBQyxZQUFZLEVBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVMsRUFBRTtvQkFDdkcsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLFVBQVMsQ0FBQzt3QkFDdkIsT0FBTyxJQUFJLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNwQyxDQUFDLENBQUMsQ0FBQztnQkFDSixDQUFDLENBQUMsQ0FBQztZQUNKLENBQUM7WUFDQSxPQUFPLEVBQUU7Z0JBQ1QsT0FBTyxJQUFJLG9CQUFvQixDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUM1RSxDQUFDO1lBQ0EsWUFBWSxFQUFFO2dCQUNkLE9BQU8sbUJBQW1CLENBQUMsY0FBYyxDQUFDLGdCQUFnQixFQUFDLGNBQWMsRUFBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFTLENBQUM7b0JBQ3RHLE9BQU8sSUFBSSxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEMsQ0FBQyxDQUFDLENBQUM7WUFDSixDQUFDO1lBQ0EsVUFBVSxFQUFFLFVBQVMsU0FBUztnQkFDOUIsT0FBTyxjQUFjLENBQUMsMkJBQTJCLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBQyxTQUFTLEVBQUMsS0FBSyxDQUFDLENBQUM7WUFDL0UsQ0FBQztZQUNBLGVBQWUsRUFBRSxVQUFTLFNBQVM7Z0JBQ25DLE9BQU8sbUJBQW1CLENBQUMsY0FBYyxDQUFDLGNBQWMsRUFBQyw2QkFBNkIsRUFBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUMsU0FBUyxFQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDdEgsQ0FBQztZQUNBLFNBQVMsRUFBRSxvQkFBb0I7U0FDaEMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxhQUFhLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsVUFBUyxNQUFNLEVBQUMsS0FBSyxFQUFDLEtBQUssRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLFFBQVE7WUFDOUYsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksRUFBQyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsS0FBSyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNoRyxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztZQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztZQUNwQixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztZQUNwQixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztZQUN0QixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztZQUMxQixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUMzQixDQUFDLENBQUM7UUFDRixVQUFVLENBQUMsZUFBZSxDQUFDLEdBQUcsYUFBYSxDQUFDO1FBQzVDLGFBQWEsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9DLGFBQWEsQ0FBQyxTQUFTLEdBQUcsb0JBQW9CLENBQUM7UUFDL0MsYUFBYSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsU0FBUyxFQUFDO1lBQ2hFLE1BQU0sRUFBRTtnQkFDUCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDckIsQ0FBQztZQUNBLEtBQUssRUFBRTtnQkFDUCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDcEIsQ0FBQztZQUNBLEtBQUssRUFBRTtnQkFDUCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDcEIsQ0FBQztZQUNBLE1BQU0sRUFBRTtnQkFDUixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDckIsQ0FBQztZQUNBLFFBQVEsRUFBRTtnQkFDVixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDdkIsQ0FBQztZQUNBLFFBQVEsRUFBRTtnQkFDVixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDdkIsQ0FBQztZQUNBLFNBQVMsRUFBRSxhQUFhO1NBQ3pCLENBQUMsQ0FBQztRQUNILElBQUkscUJBQXFCLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBUyxNQUFNLEVBQUMsT0FBTztZQUNqRixvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNwRixDQUFDLENBQUM7UUFDRixVQUFVLENBQUMsdUJBQXVCLENBQUMsR0FBRyxxQkFBcUIsQ0FBQztRQUM1RCxxQkFBcUIsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQy9ELHFCQUFxQixDQUFDLFNBQVMsR0FBRyxvQkFBb0IsQ0FBQztRQUN2RCxxQkFBcUIsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLFNBQVMsRUFBQztZQUN4RSxTQUFTLEVBQUUscUJBQXFCO1NBQ2hDLENBQUMsQ0FBQztRQUNILElBQUksZ0JBQWdCLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsVUFBUyxNQUFNLEVBQUMsS0FBSyxFQUFDLEtBQUssRUFBQyxNQUFNO1lBQ2xGLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsS0FBSyxFQUFDLE1BQU0sRUFBQyxDQUFDLEVBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNsRSxDQUFDLENBQUM7UUFDRixVQUFVLENBQUMsa0JBQWtCLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQztRQUNsRCxnQkFBZ0IsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JELGdCQUFnQixDQUFDLFNBQVMsR0FBRyxhQUFhLENBQUM7UUFDM0MsZ0JBQWdCLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFDO1lBQzVELFNBQVMsRUFBRSxnQkFBZ0I7U0FDM0IsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxrQkFBa0IsR0FBRyxjQUFhLENBQUMsQ0FBQztRQUN4QyxVQUFVLENBQUMsb0JBQW9CLENBQUMsR0FBRyxrQkFBa0IsQ0FBQztRQUN0RCxrQkFBa0IsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3pELGtCQUFrQixDQUFDLGNBQWMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDOUQsa0JBQWtCLENBQUMsU0FBUyxHQUFHO1lBQzlCLFNBQVMsRUFBRSxrQkFBa0I7U0FDN0IsQ0FBQztRQUNGLElBQUksc0JBQXNCLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxZQUFZLEdBQUcsVUFBUyxJQUFJO1lBQ3pFLElBQUksQ0FBQyxLQUFLLEdBQUcsZUFBZSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVELENBQUMsQ0FBQztRQUNGLFVBQVUsQ0FBQyx3QkFBd0IsQ0FBQyxHQUFHLHNCQUFzQixDQUFDO1FBQzlELHNCQUFzQixDQUFDLFFBQVEsR0FBRyxDQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsY0FBYyxDQUFDLENBQUM7UUFDakUsc0JBQXNCLENBQUMsY0FBYyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUM3RCxzQkFBc0IsQ0FBQywyQkFBMkIsR0FBRyxVQUFTLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxhQUFhLEVBQUMsT0FBTztZQUNoSCxPQUFPLElBQUksc0JBQXNCLENBQUMsSUFBSSwwQkFBMEIsQ0FBQyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JKLENBQUMsQ0FBQztRQUNGLHNCQUFzQixDQUFDLFNBQVMsR0FBRyxVQUFTLE1BQU0sRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLE1BQU07WUFDdEUsT0FBTyxJQUFJLHNCQUFzQixDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2pHLENBQUMsQ0FBQztRQUNGLHNCQUFzQixDQUFDLGVBQWUsR0FBRyxVQUFTLE1BQU0sRUFBQyxPQUFPO1lBQy9ELE9BQU8sSUFBSSxzQkFBc0IsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBUyxLQUFLO2dCQUM3RSxJQUFJLEVBQUUsQ0FBQztnQkFDUCxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUM7Z0JBQ1o7b0JBQ0MsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO29CQUNaLE9BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUU7d0JBQzFCLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDcEIsRUFBRSxHQUFHLENBQUM7d0JBQ04sRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztxQkFDckI7aUJBQ0Q7Z0JBQ0QsRUFBRSxHQUFHLEVBQUUsQ0FBQztnQkFDUixPQUFPLEVBQUUsQ0FBQztZQUNYLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDcEIsQ0FBQyxDQUFDO1FBQ0Ysc0JBQXNCLENBQUMsU0FBUyxHQUFHLDBCQUEwQixDQUFDO1FBQzlELHNCQUFzQixDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsMEJBQTBCLENBQUMsU0FBUyxFQUFDO1lBQy9FLE9BQU8sRUFBRTtnQkFDUixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO1lBQzNCLENBQUM7WUFDQSxPQUFPLEVBQUU7Z0JBQ1QsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQztZQUMzQixDQUFDO1lBQ0EsTUFBTSxFQUFFO2dCQUNSLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25DLENBQUM7WUFDQSxNQUFNLEVBQUU7Z0JBQ1IsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkMsQ0FBQztZQUNBLGFBQWEsRUFBRTtnQkFDZixPQUFPLGNBQWMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNoRSxDQUFDO1lBQ0EsT0FBTyxFQUFFO2dCQUNULE9BQU8sY0FBYyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzFELENBQUM7WUFDQSxPQUFPLEVBQUU7Z0JBQ1QsT0FBTyxJQUFJLDBCQUEwQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBQyxjQUFjLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsRUFBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ25LLENBQUM7WUFDQSxLQUFLLEVBQUU7Z0JBQ1AsT0FBTyxJQUFJLHNCQUFzQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBQ25ELENBQUM7WUFDQSxPQUFPLEVBQUU7Z0JBQ1QsT0FBTyxJQUFJLGtCQUFrQixDQUFDLHlCQUF5QixDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDckksQ0FBQztZQUNBLE9BQU8sRUFBRTtnQkFDVCxPQUFPLElBQUksa0JBQWtCLENBQUMseUJBQXlCLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNySSxDQUFDO1lBQ0EsS0FBSyxFQUFFLFVBQVMsQ0FBQyxFQUFDLENBQUM7Z0JBQ25CLE9BQU8sY0FBYyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVELENBQUM7WUFDQSxVQUFVLEVBQUUsVUFBUyxDQUFDLEVBQUMsQ0FBQztnQkFDeEIsT0FBTyxtQkFBbUIsQ0FBQyxjQUFjLENBQUMsY0FBYyxFQUFDLHNCQUFzQixFQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuRyxDQUFDO1lBQ0EsTUFBTSxFQUFFLFVBQVMsQ0FBQyxFQUFDLENBQUM7Z0JBQ3BCLE9BQU8sY0FBYyxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdELENBQUM7WUFDQSxXQUFXLEVBQUUsVUFBUyxDQUFDLEVBQUMsQ0FBQztnQkFDekIsT0FBTyxtQkFBbUIsQ0FBQyxjQUFjLENBQUMsY0FBYyxFQUFDLHVCQUF1QixFQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwRyxDQUFDO1lBQ0EsV0FBVyxFQUFFLFVBQVMsQ0FBQyxFQUFDLENBQUMsRUFBQyxTQUFTO2dCQUNuQyxJQUFHLFNBQVMsSUFBSSxJQUFJO29CQUFFLFNBQVMsR0FBRyxDQUFDLENBQUM7Z0JBQ3BDLE9BQU8sY0FBYyxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxTQUFTLENBQUMsQ0FBQztZQUM1RSxDQUFDO1lBQ0EsZ0JBQWdCLEVBQUUsVUFBUyxDQUFDLEVBQUMsQ0FBQyxFQUFDLFNBQVM7Z0JBQ3hDLElBQUcsU0FBUyxJQUFJLElBQUk7b0JBQUUsU0FBUyxHQUFHLENBQUMsQ0FBQztnQkFDcEMsT0FBTyxtQkFBbUIsQ0FBQyxjQUFjLENBQUMsY0FBYyxFQUFDLDRCQUE0QixFQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDbkgsQ0FBQztZQUNBLFlBQVksRUFBRSxVQUFTLEVBQUU7Z0JBQ3pCLE9BQU8saUJBQWlCLENBQUMsMkJBQTJCLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBQyxFQUFFLENBQUMsQ0FBQztZQUNyRSxDQUFDO1lBQ0EsaUJBQWlCLEVBQUUsVUFBUyxFQUFFO2dCQUM5QixPQUFPLG1CQUFtQixDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsRUFBQyw2QkFBNkIsRUFBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM1RyxDQUFDO1lBQ0EsWUFBWSxFQUFFLFVBQVMsRUFBRTtnQkFDekIsT0FBTyxpQkFBaUIsQ0FBQywyQkFBMkIsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3JFLENBQUM7WUFDQSxpQkFBaUIsRUFBRSxVQUFTLEVBQUU7Z0JBQzlCLE9BQU8sbUJBQW1CLENBQUMsY0FBYyxDQUFDLGlCQUFpQixFQUFDLDZCQUE2QixFQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzVHLENBQUM7WUFDQSxLQUFLLEVBQUUsVUFBUyxDQUFDLEVBQUMsSUFBSTtnQkFDdEIsSUFBRyxJQUFJLElBQUksSUFBSTtvQkFBRSxJQUFJLEdBQUcsS0FBSyxDQUFDO2dCQUM5QixPQUFPLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFDLENBQUMsRUFBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBUyxDQUFDO29CQUNyRSxPQUFPLElBQUksc0JBQXNCLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RDLENBQUMsQ0FBQyxDQUFDO1lBQ0osQ0FBQztZQUNBLFVBQVUsRUFBRSxVQUFTLENBQUMsRUFBQyxJQUFJO2dCQUMzQixJQUFHLElBQUksSUFBSSxJQUFJO29CQUFFLElBQUksR0FBRyxLQUFLLENBQUM7Z0JBQzlCLE9BQU8sbUJBQW1CLENBQUMsY0FBYyxDQUFDLGdCQUFnQixFQUFDLGNBQWMsRUFBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUMsQ0FBQyxFQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVMsQ0FBQztvQkFDN0csT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVMsQ0FBQzt3QkFDdEIsT0FBTyxJQUFJLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN0QyxDQUFDLENBQUMsQ0FBQztnQkFDSixDQUFDLENBQUMsQ0FBQztZQUNKLENBQUM7WUFDQSxPQUFPLEVBQUUsVUFBUyxJQUFJO2dCQUN0QixJQUFHLElBQUksSUFBSSxJQUFJO29CQUFFLElBQUksR0FBRyxLQUFLLENBQUM7Z0JBQzlCLE9BQU8sSUFBSSxzQkFBc0IsQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3JGLENBQUM7WUFDQSxZQUFZLEVBQUUsVUFBUyxJQUFJO2dCQUMzQixJQUFHLElBQUksSUFBSSxJQUFJO29CQUFFLElBQUksR0FBRyxLQUFLLENBQUM7Z0JBQzlCLE9BQU8sbUJBQW1CLENBQUMsY0FBYyxDQUFDLGdCQUFnQixFQUFDLGdCQUFnQixFQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFTLENBQUM7b0JBQzdHLE9BQU8sSUFBSSxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEMsQ0FBQyxDQUFDLENBQUM7WUFDSixDQUFDO1lBQ0EsUUFBUSxFQUFFLFVBQVMsQ0FBQyxFQUFDLElBQUk7Z0JBQ3pCLElBQUcsSUFBSSxJQUFJLElBQUk7b0JBQUUsSUFBSSxHQUFHLEtBQUssQ0FBQztnQkFDOUIsT0FBTyxJQUFJLG9CQUFvQixDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBQyxDQUFDLEVBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNwRixDQUFDO1lBQ0EsYUFBYSxFQUFFLFVBQVMsQ0FBQyxFQUFDLElBQUk7Z0JBQzlCLElBQUcsSUFBSSxJQUFJLElBQUk7b0JBQUUsSUFBSSxHQUFHLEtBQUssQ0FBQztnQkFDOUIsT0FBTyxtQkFBbUIsQ0FBQyxjQUFjLENBQUMsY0FBYyxFQUFDLGlCQUFpQixFQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBQyxDQUFDLEVBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBUyxDQUFDO29CQUM5RyxPQUFPLElBQUksb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BDLENBQUMsQ0FBQyxDQUFDO1lBQ0osQ0FBQztZQUNBLFVBQVUsRUFBRSxVQUFTLE9BQU87Z0JBQzVCLE9BQU8sY0FBYyxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBUyxDQUFDO29CQUNyRSxPQUFPLElBQUksb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BDLENBQUMsQ0FBQyxDQUFDO1lBQ0osQ0FBQztZQUNBLGVBQWUsRUFBRSxVQUFTLE9BQU87Z0JBQ2pDLE9BQU8sbUJBQW1CLENBQUMsY0FBYyxDQUFDLGNBQWMsRUFBQyx1QkFBdUIsRUFBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFTLEVBQUU7b0JBQzlHLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFTLENBQUM7d0JBQ3ZCLE9BQU8sSUFBSSxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDcEMsQ0FBQyxDQUFDLENBQUM7Z0JBQ0osQ0FBQyxDQUFDLENBQUM7WUFDSixDQUFDO1lBQ0EsVUFBVSxFQUFFLFVBQVMsT0FBTztnQkFDNUIsT0FBTyxjQUFjLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBQyxPQUFPLENBQUMsQ0FBQztZQUNuRSxDQUFDO1lBQ0EsZUFBZSxFQUFFLFVBQVMsT0FBTztnQkFDakMsT0FBTyxtQkFBbUIsQ0FBQyxjQUFjLENBQUMsY0FBYyxFQUFDLHlCQUF5QixFQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQzFHLENBQUM7WUFDQSxTQUFTLEVBQUUsVUFBUyxHQUFHO2dCQUN2QixPQUFPLElBQUksc0JBQXNCLENBQUMsZ0JBQWdCLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzlGLENBQUM7WUFDQSxjQUFjLEVBQUUsVUFBUyxHQUFHO2dCQUM1QixPQUFPLG1CQUFtQixDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsRUFBQywwQkFBMEIsRUFBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBUyxDQUFDO29CQUN0SCxPQUFPLElBQUksc0JBQXNCLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RDLENBQUMsQ0FBQyxDQUFDO1lBQ0osQ0FBQztZQUNBLFNBQVMsRUFBRSxzQkFBc0I7U0FDbEMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSx3QkFBd0IsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxVQUFTLElBQUksRUFBQyxLQUFLLEVBQUMsSUFBSSxFQUFDLE1BQU0sRUFBQyxNQUFNO1lBQ3RHLHNCQUFzQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUMsS0FBSyxFQUFDLElBQUksRUFBQyxNQUFNLEVBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUMvRixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztZQUNsQixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztZQUNwQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztZQUNsQixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztZQUN0QixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN2QixDQUFDLENBQUM7UUFDRixVQUFVLENBQUMsMEJBQTBCLENBQUMsR0FBRyx3QkFBd0IsQ0FBQztRQUNsRSx3QkFBd0IsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDckUsd0JBQXdCLENBQUMsU0FBUyxHQUFHLHNCQUFzQixDQUFDO1FBQzVELHdCQUF3QixDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsU0FBUyxFQUFDO1lBQzdFLElBQUksRUFBRTtnQkFDTCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDbkIsQ0FBQztZQUNBLEtBQUssRUFBRTtnQkFDUCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDcEIsQ0FBQztZQUNBLElBQUksRUFBRTtnQkFDTixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDbkIsQ0FBQztZQUNBLE1BQU0sRUFBRTtnQkFDUixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDckIsQ0FBQztZQUNBLE1BQU0sRUFBRTtnQkFDUixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDckIsQ0FBQztZQUNBLFNBQVMsRUFBRSx3QkFBd0I7U0FDcEMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSw0QkFBNEIsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLFVBQVMsSUFBSSxFQUFDLEtBQUssRUFBQyxJQUFJLEVBQUMsTUFBTSxFQUFDLE1BQU07WUFDOUcsc0JBQXNCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBQyxjQUFjLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFDLEtBQUssRUFBQyxJQUFJLEVBQUMsTUFBTSxFQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDbkcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDbEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7WUFDcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDbEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7WUFDdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdkIsQ0FBQyxDQUFDO1FBQ0YsVUFBVSxDQUFDLDhCQUE4QixDQUFDLEdBQUcsNEJBQTRCLENBQUM7UUFDMUUsNEJBQTRCLENBQUMsUUFBUSxHQUFHLENBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQzdFLDRCQUE0QixDQUFDLFNBQVMsR0FBRyxzQkFBc0IsQ0FBQztRQUNoRSw0QkFBNEIsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDLFNBQVMsRUFBQztZQUNqRixJQUFJLEVBQUU7Z0JBQ0wsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ25CLENBQUM7WUFDQSxLQUFLLEVBQUU7Z0JBQ1AsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQ3BCLENBQUM7WUFDQSxJQUFJLEVBQUU7Z0JBQ04sT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ25CLENBQUM7WUFDQSxNQUFNLEVBQUU7Z0JBQ1IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQ3JCLENBQUM7WUFDQSxNQUFNLEVBQUU7Z0JBQ1IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQ3JCLENBQUM7WUFDQSxTQUFTLEVBQUUsNEJBQTRCO1NBQ3hDLENBQUMsQ0FBQztRQUNILElBQUksb0JBQW9CLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBUyxNQUFNLEVBQUMsS0FBSyxFQUFDLEtBQUssRUFBQyxRQUFRLEVBQUMsUUFBUTtZQUNyRyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFDLEtBQUssRUFBQyxLQUFLLEVBQUMsUUFBUSxFQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDaEcsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7WUFDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7WUFDcEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7WUFDcEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7WUFDMUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDM0IsQ0FBQyxDQUFDO1FBQ0YsVUFBVSxDQUFDLHNCQUFzQixDQUFDLEdBQUcsb0JBQW9CLENBQUM7UUFDMUQsb0JBQW9CLENBQUMsUUFBUSxHQUFHLENBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxZQUFZLENBQUMsQ0FBQztRQUM3RCxvQkFBb0IsQ0FBQyxTQUFTLEdBQUcsb0JBQW9CLENBQUM7UUFDdEQsb0JBQW9CLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLEVBQUM7WUFDdkUsTUFBTSxFQUFFO2dCQUNQLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUNyQixDQUFDO1lBQ0EsS0FBSyxFQUFFO2dCQUNQLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUNwQixDQUFDO1lBQ0EsS0FBSyxFQUFFO2dCQUNQLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUNwQixDQUFDO1lBQ0EsUUFBUSxFQUFFO2dCQUNWLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUN2QixDQUFDO1lBQ0EsUUFBUSxFQUFFO2dCQUNWLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUN2QixDQUFDO1lBQ0EsU0FBUyxFQUFFLG9CQUFvQjtTQUNoQyxDQUFDLENBQUM7UUFDSCxJQUFJLGlCQUFpQixHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLFVBQVMsTUFBTSxFQUFDLEtBQUssRUFBQyxLQUFLO1lBQzdFLG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUMsTUFBTSxFQUFDLEtBQUssRUFBQyxLQUFLLEVBQUMsQ0FBQyxFQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbEUsQ0FBQyxDQUFDO1FBQ0YsVUFBVSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsaUJBQWlCLENBQUM7UUFDcEQsaUJBQWlCLENBQUMsUUFBUSxHQUFHLENBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxTQUFTLENBQUMsQ0FBQztRQUN2RCxpQkFBaUIsQ0FBQyxTQUFTLEdBQUcsb0JBQW9CLENBQUM7UUFDbkQsaUJBQWlCLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLEVBQUM7WUFDcEUsU0FBUyxFQUFFLGlCQUFpQjtTQUM1QixDQUFDLENBQUM7UUFDSCxJQUFJLHlCQUF5QixHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsZUFBZSxHQUFHLFVBQVMsT0FBTyxFQUFDLFNBQVM7WUFDNUYsc0JBQXNCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBQyxjQUFjLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEVBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3RKLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO1FBQzdCLENBQUMsQ0FBQztRQUNGLFVBQVUsQ0FBQywyQkFBMkIsQ0FBQyxHQUFHLHlCQUF5QixDQUFDO1FBQ3BFLHlCQUF5QixDQUFDLFFBQVEsR0FBRyxDQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUN2RSx5QkFBeUIsQ0FBQyxTQUFTLEdBQUcsc0JBQXNCLENBQUM7UUFDN0QseUJBQXlCLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxTQUFTLEVBQUM7WUFDOUUsT0FBTyxFQUFFO2dCQUNSLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUN0QixDQUFDO1lBQ0EsU0FBUyxFQUFFO2dCQUNYLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUN4QixDQUFDO1lBQ0EsU0FBUyxFQUFFLHlCQUF5QjtTQUNyQyxDQUFDLENBQUM7UUFDSCxJQUFJLG1CQUFtQixHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLGNBQWEsQ0FBQyxDQUFDO1FBQ3RFLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLG1CQUFtQixDQUFDO1FBQ3hELG1CQUFtQixDQUFDLFFBQVEsR0FBRyxDQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsV0FBVyxDQUFDLENBQUM7UUFDM0QsbUJBQW1CLENBQUMsTUFBTSxHQUFHLFVBQVMsS0FBSyxFQUFDLE1BQU0sRUFBQyxHQUFHO1lBQ3JELElBQUcsR0FBRyxJQUFJLElBQUk7Z0JBQUUsR0FBRyxHQUFHLElBQUksQ0FBQztZQUMzQixPQUFPLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEVBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxFQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3pFLENBQUMsQ0FBQztRQUNGLG1CQUFtQixDQUFDLFdBQVcsR0FBRyxVQUFTLEtBQUssRUFBQyxNQUFNLEVBQUMsR0FBRztZQUMxRCxJQUFHLEdBQUcsSUFBSSxJQUFJO2dCQUFFLEdBQUcsR0FBRyxJQUFJLENBQUM7WUFDM0IsT0FBTyxtQkFBbUIsQ0FBQyxjQUFjLENBQUMsbUJBQW1CLEVBQUMsUUFBUSxFQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxFQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsRUFBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2hILENBQUMsQ0FBQztRQUNGLG1CQUFtQixDQUFDLGVBQWUsR0FBRyxVQUFTLEtBQUssRUFBQyxPQUFPLEVBQUMsR0FBRztZQUMvRCxJQUFHLEdBQUcsSUFBSSxJQUFJO2dCQUFFLEdBQUcsR0FBRyxJQUFJLENBQUM7WUFDM0IsT0FBTyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxFQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBQyxHQUFHLENBQUMsQ0FBQztRQUNuRixDQUFDLENBQUM7UUFDRixtQkFBbUIsQ0FBQyxvQkFBb0IsR0FBRyxVQUFTLEtBQUssRUFBQyxPQUFPLEVBQUMsR0FBRztZQUNwRSxJQUFHLEdBQUcsSUFBSSxJQUFJO2dCQUFFLEdBQUcsR0FBRyxJQUFJLENBQUM7WUFDM0IsT0FBTyxtQkFBbUIsQ0FBQyxjQUFjLENBQUMsbUJBQW1CLEVBQUMsaUJBQWlCLEVBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEVBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDMUgsQ0FBQyxDQUFDO1FBQ0YsbUJBQW1CLENBQUMsUUFBUSxHQUFHLFVBQVMsS0FBSyxFQUFDLE1BQU0sRUFBQyxHQUFHO1lBQ3ZELElBQUcsR0FBRyxJQUFJLElBQUk7Z0JBQUUsR0FBRyxHQUFHLElBQUksQ0FBQztZQUMzQixPQUFPLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEVBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxFQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFTLEVBQUU7Z0JBQ3hGLE9BQU8sSUFBSSxvQkFBb0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNyQyxDQUFDLENBQUMsQ0FBQztRQUNKLENBQUMsQ0FBQztRQUNGLG1CQUFtQixDQUFDLGFBQWEsR0FBRyxVQUFTLEtBQUssRUFBQyxNQUFNLEVBQUMsR0FBRztZQUM1RCxJQUFHLEdBQUcsSUFBSSxJQUFJO2dCQUFFLEdBQUcsR0FBRyxJQUFJLENBQUM7WUFDM0IsT0FBTyxtQkFBbUIsQ0FBQyxjQUFjLENBQUMsbUJBQW1CLEVBQUMsVUFBVSxFQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxFQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsRUFBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFTLEdBQUc7Z0JBQ2pJLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFTLEVBQUU7b0JBQ3pCLE9BQU8sSUFBSSxvQkFBb0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDckMsQ0FBQyxDQUFDLENBQUM7WUFDSixDQUFDLENBQUMsQ0FBQztRQUNKLENBQUMsQ0FBQztRQUNGLElBQUksY0FBYyxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLFVBQVMsS0FBSyxFQUFDLEdBQUc7WUFDOUQsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksRUFBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxFQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyRSxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztZQUNwQixJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUNqQixDQUFDLENBQUM7UUFDRixVQUFVLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxjQUFjLENBQUM7UUFDOUMsY0FBYyxDQUFDLFFBQVEsR0FBRyxDQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsTUFBTSxDQUFDLENBQUM7UUFDakQsY0FBYyxDQUFDLFNBQVMsR0FBRyxvQkFBb0IsQ0FBQztRQUNoRCxjQUFjLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLEVBQUM7WUFDakUsS0FBSyxFQUFFO2dCQUNOLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUNwQixDQUFDO1lBQ0EsR0FBRyxFQUFFO2dCQUNMLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztZQUNsQixDQUFDO1lBQ0EsU0FBUyxFQUFFLGNBQWM7U0FDMUIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSx5QkFBeUIsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxVQUFTLE9BQU8sRUFBQyxNQUFNLEVBQUMsSUFBSSxFQUFDLEtBQUs7WUFDcEcsc0JBQXNCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBQyxjQUFjLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBQyxNQUFNLEVBQUMsSUFBSSxFQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDdEcsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7WUFDeEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7WUFDdEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDbEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDckIsQ0FBQyxDQUFDO1FBQ0YsVUFBVSxDQUFDLDJCQUEyQixDQUFDLEdBQUcseUJBQXlCLENBQUM7UUFDcEUseUJBQXlCLENBQUMsUUFBUSxHQUFHLENBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3ZFLHlCQUF5QixDQUFDLFNBQVMsR0FBRyxzQkFBc0IsQ0FBQztRQUM3RCx5QkFBeUIsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDLFNBQVMsRUFBQztZQUM5RSxPQUFPLEVBQUU7Z0JBQ1IsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQ3RCLENBQUM7WUFDQSxNQUFNLEVBQUU7Z0JBQ1IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQ3JCLENBQUM7WUFDQSxJQUFJLEVBQUU7Z0JBQ04sT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQ3JCLENBQUM7WUFDQSxLQUFLLEVBQUU7Z0JBQ1AsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQ3BCLENBQUM7WUFDQSxTQUFTLEVBQUUseUJBQXlCO1NBQ3JDLENBQUMsQ0FBQztRQUNILElBQUksMEJBQTBCLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxVQUFTLE1BQU0sRUFBQyxNQUFNO1lBQzFGLHNCQUFzQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDakcsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7WUFDdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdkIsQ0FBQyxDQUFDO1FBQ0YsVUFBVSxDQUFDLDRCQUE0QixDQUFDLEdBQUcsMEJBQTBCLENBQUM7UUFDdEUsMEJBQTBCLENBQUMsUUFBUSxHQUFHLENBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3pFLDBCQUEwQixDQUFDLFNBQVMsR0FBRyxzQkFBc0IsQ0FBQztRQUM5RCwwQkFBMEIsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDLFNBQVMsRUFBQztZQUMvRSxNQUFNLEVBQUU7Z0JBQ1AsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQ3JCLENBQUM7WUFDQSxNQUFNLEVBQUU7Z0JBQ1IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQ3JCLENBQUM7WUFDQSxTQUFTLEVBQUUsMEJBQTBCO1NBQ3RDLENBQUMsQ0FBQztRQUNILElBQUksc0JBQXNCLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxZQUFZLEdBQUcsVUFBUyxPQUFPLEVBQUMsSUFBSTtZQUNqRixzQkFBc0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFDLGNBQWMsQ0FBQyw0QkFBNEIsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNoSCxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztZQUN4QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNuQixDQUFDLENBQUM7UUFDRixVQUFVLENBQUMsd0JBQXdCLENBQUMsR0FBRyxzQkFBc0IsQ0FBQztRQUM5RCxzQkFBc0IsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ2pFLHNCQUFzQixDQUFDLFNBQVMsR0FBRyxzQkFBc0IsQ0FBQztRQUMxRCxzQkFBc0IsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDLFNBQVMsRUFBQztZQUMzRSxPQUFPLEVBQUU7Z0JBQ1IsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQ3RCLENBQUM7WUFDQSxJQUFJLEVBQUU7Z0JBQ04sT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ25CLENBQUM7WUFDQSxTQUFTLEVBQUUsc0JBQXNCO1NBQ2xDLENBQUMsQ0FBQztRQUNILFNBQVMsU0FBUyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLO1lBQUcsT0FBTyxjQUFhLE9BQU8sV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sT0FBTSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUNqTCxJQUFJLEVBQUUsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLFNBQVMsS0FBSyxDQUFDLENBQUMsRUFBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksSUFBSTtZQUFHLE9BQU8sSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxJQUFJLElBQUk7WUFBRyxDQUFDLENBQUMsTUFBTSxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxjQUFjLElBQUksSUFBSTtZQUFHLENBQUMsQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDOztZQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRztZQUFFLENBQUMsR0FBRyxjQUFZLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7U0FBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2VixVQUFVLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUN2QixNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FB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QUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLENBQUMsQ0FBQztRQUN4MVksaUJBQWlCLENBQUMsT0FBTyxHQUFHLENBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxDQUFDLEdBQUcsRUFBQyxHQUFHLENBQUMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLENBQUMsQ0FBQztRQUM3alosbUJBQW1CLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztRQUNoQyxtQkFBbUIsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ2xDLG1CQUFtQixDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDbEMsMEJBQTBCLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztRQUNwQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDakIsQ0FBQyxDQUFDLENBQUMsT0FBTyxPQUFPLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUMsR0FBRyxFQUFDLGNBQVcsQ0FBQyxFQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sTUFBTSxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLE1BQU0sSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRzdMLE9BQU8sSUFBSSxDQUFDO0FBRWhCLENBQUMsQ0FBQyxDQUFDIn0=