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
            console.log("verb 2.1.0");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVyYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWJzL3ZlcmIvdmVyYi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxpQ0FBaUM7QUFDakMsb0dBQW9HO0FBRXBHLENBQUMsVUFBUyxDQUFDO0lBQ1AsSUFBRyxPQUFPLE9BQU8sS0FBRyxRQUFRLElBQUUsT0FBTyxNQUFNLEtBQUcsV0FBVyxFQUFDO1FBQ3RELE1BQU0sQ0FBQyxPQUFPLEdBQUMsQ0FBQyxFQUFFLENBQUE7S0FDckI7U0FBTSxJQUFHLE9BQU8sTUFBTSxLQUFHLFVBQVUsSUFBRSxNQUFNLENBQUMsR0FBRyxFQUFDO1FBQzdDLE1BQU0sQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUE7S0FDZjtTQUFNO1FBQ0gsSUFBSSxDQUFDLENBQUM7UUFDTixJQUFHLE9BQU8sTUFBTSxLQUFHLFdBQVcsRUFBQztZQUMzQixDQUFDLEdBQUMsTUFBTSxDQUFBO1NBQ1g7YUFBTSxJQUFHLE9BQU8sTUFBTSxLQUFHLFdBQVcsRUFBQztZQUNsQyxDQUFDLEdBQUMsTUFBTSxDQUFBO1NBQ1g7YUFBTSxJQUFHLE9BQU8sSUFBSSxLQUFHLFdBQVcsRUFBQztZQUNoQyxDQUFDLEdBQUMsSUFBSSxDQUFBO1NBQ1Q7YUFBSztZQUNGLENBQUMsR0FBQyxJQUFJLENBQUE7U0FDVDtRQUVELENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUE7S0FDZjtBQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0MsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBRWQsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDO0lBRWxCLElBQUksU0FBUyxHQUFHLElBQUksUUFBUSxDQUFDLHFEQUFxRCxDQUFDLENBQUM7SUFDdkYsaUZBQWlGO0lBQ2pGLDRHQUE0RztJQUV6Ryx3Q0FBd0M7SUFDeEMscUNBQXFDO0lBQ3JDLG9EQUFvRDtJQUNwRCxJQUFJO0lBRUosa0NBQWtDO0lBQ2xDLG9D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QUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt3Q0FDbEMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQzt3Q0FDbkQsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQzt3Q0FDbkQsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO3FDQUNsQztvQ0FDRCxJQUFHLEVBQUUsSUFBSSxHQUFHLEVBQUU7d0NBQ2IsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO3dDQUN2QixJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7d0NBQ3ZCLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt3Q0FDbkMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQzt3Q0FDckQsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztxQ0FDeEM7eUNBQU0sSUFBRyxFQUFFLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRTt3Q0FDeEIsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFF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WCxPQUFPLEVBQUUsQ0FBQztvQkFDWCxLQUFLLEdBQUc7d0JBQ1AsSUFBSSxDQUFDLENBQUM7d0JBQ04sSUFBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7NEJBQzNYLElBQUksRUFBRSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBQyxJQUFJLENBQUMsR0FBRyxFQUFDLEVBQUUsQ0FBQyxDQUFDOzRCQUNsRCxDQUFDLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQzs0QkFDNUIsSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUM7eUJBQ2Y7NkJBQU07NEJBQ04sSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDOzRCQUN6QixJQUFJLEVBQUUsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDOzRCQUNwQixFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNkLENBQUMsR0FBRyxFQUFFLENBQUM7eUJBQ1A7d0JBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ25CLE9BQU8sQ0FBQyxDQUFDO29CQUNWLEtBQUssR0FBRzt3QkFDUCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7d0JBQzdCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7d0JBQ3BCLElBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUk7NEJBQUUsTUFBTSxJQUFJLG1CQUFtQixDQUFDLHNCQUFzQixDQUFDLENBQUM7d0JBQ3RILElBQUksS0FBSyxHQUFHLGlCQUFpQixDQUFDLEtBQUssQ0FBQzt3QkFDcEMsSUFBRyxLQUFLLElBQUksSUFBSSxFQUFFOzRCQUNqQixLQUFLLEdBQUcsaUJBQWlCLENBQUMsU0FBUyxFQUFFLENBQUM7NEJBQ3RDLGlCQUFpQixDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7eUJBQ2hDO3dCQUNELElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7d0JBQ2xCLElBQUksSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLENBQUM7d0JBQ3BCLElBQUksSUFBSSxDQUFDO3dCQUNULElBQUksR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFBLENBQUMsQ0FBQSxJQUFJLEdBQUcsQ0FBQyxDQUFBLENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQzt3QkFDaEQsSUFBSSxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO3dCQUM3QixJQUFJLEtBQUssR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUN0QyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7d0JBQ2IsT0FBTSxFQUFFLEdBQUcsR0FBRyxFQUFFOzRCQUNmLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLElBQUksRUFBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7NEJBQ25ELElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLElBQUksRUFBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7NEJBQ2xELEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7NEJBQ3JDLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLElBQUksRUFBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7NEJBQ2xELEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7NEJBQ3BDLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLElBQUksRUFBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7NEJBQ2xELEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQzt5QkFDL0I7d0JBQ0QsSUFBRyxJQUFJLElBQUksQ0FBQyxFQUFFOzRCQUNiLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLElBQUks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LElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0IsSUFBSSxFQUFFLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakMsSUFBSSxFQUFFLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakMsSUFBSSxFQUFFLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakMsSUFBSSxDQUFDLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQyxFQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuRyxJQUFJLEVBQUUsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzVELElBQUksRUFBRSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDNUQsSUFBSSxFQUFFLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFD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RyxFQUFDLElBQUksRUFBQyxTQUFTO1lBQzFFLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RFLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvRCxJQUFJLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0csSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FB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QUFPLGNBQWEsT0FBTyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxPQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ2pMLElBQUksRUFBRSxFQUFFLElBQUksR0FBRyxDQUFDLENBQUM7UUFDakIsU0FBUyxLQUFLLENBQUMsQ0FBQyxFQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJO1lBQUcsT0FBTyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksSUFBSTtZQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLGNBQWMsSUFBSSxJQUFJO1lBQUcsQ0FBQyxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7O1lBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFHO1lBQUUsQ0FBQyxHQUFHLGNBQVksT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7WUFBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZWLFVBQVUsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FB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LENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsQ0FBQyxDQUFDO1FBQ3gxWSxpQkFBaUIsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLENBQUMsR0FBRyxFQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsQ0FBQyxDQUFDO1FBQzdqWixtQkFBbUIsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ2hDLG1CQUFtQixDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbEMsbUJBQW1CLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNsQywwQkFBMEIsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ3BDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNqQixDQUFDLENBQUMsQ0FBQyxPQUFPLE9BQU8sSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBQyxHQUFHLEVBQUMsY0FBVyxDQUFDLEVBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxNQUFNLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sTUFBTSxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7SUFHN0wsT0FBTyxJQUFJLENBQUM7QUFFaEIsQ0FBQyxDQUFDLENBQUMifQ==