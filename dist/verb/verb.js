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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVyYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2xpYnMvdmVyYi92ZXJiLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGlDQUFpQztBQUNqQyxvR0FBb0c7QUFFcEcsQ0FBQyxVQUFTLENBQUM7SUFDUCxJQUFHLE9BQU8sT0FBTyxLQUFHLFFBQVEsSUFBRSxPQUFPLE1BQU0sS0FBRyxXQUFXLEVBQUM7UUFDdEQsTUFBTSxDQUFDLE9BQU8sR0FBQyxDQUFDLEVBQUUsQ0FBQTtLQUNyQjtTQUFNLElBQUcsT0FBTyxNQUFNLEtBQUcsVUFBVSxJQUFFLE1BQU0sQ0FBQyxHQUFHLEVBQUM7UUFDN0MsTUFBTSxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQTtLQUNmO1NBQU07UUFDSCxJQUFJLENBQUMsQ0FBQztRQUNOLElBQUcsT0FBTyxNQUFNLEtBQUcsV0FBVyxFQUFDO1lBQzNCLENBQUMsR0FBQyxNQUFNLENBQUE7U0FDWDthQUFNLElBQUcsT0FBTyxNQUFNLEtBQUcsV0FBVyxFQUFDO1lBQ2xDLENBQUMsR0FBQyxNQUFNLENBQUE7U0FDWDthQUFNLElBQUcsT0FBTyxJQUFJLEtBQUcsV0FBVyxFQUFDO1lBQ2hDLENBQUMsR0FBQyxJQUFJLENBQUE7U0FDVDthQUFLO1lBQ0YsQ0FBQyxHQUFDLElBQUksQ0FBQTtTQUNUO1FBRUQsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQTtLQUNmO0FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDQyxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7SUFFZCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7SUFFbEIsSUFBSSxTQUFTLEdBQUcsSUFBSSxRQUFRLENBQUMscURBQXFELENBQUMsQ0FBQztJQUN2RixpRkFBaUY7SUFDakYsNEdBQTRHO0lBRXpHLHdDQUF3QztJQUN4QyxxQ0FBcUM7SUFDckMsb0RBQW9EO0lBQ3BELElBQUk7SUFFSixrQ0FBa0M7SUFDbEMsb0NBQW9DO0lB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LENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dDQUNsQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dDQUNuRCxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dDQUNuRCxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7cUNBQ2xDO29DQUNELElBQUcsRUFBRSxJQUFJLEdBQUcsRUFBRTt3Q0FDYixJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7d0NBQ3ZCLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQzt3Q0FDdkIsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dDQUNuQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dDQUNyRCxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO3FDQUN4Qzt5Q0FBTSxJQUFHLEVBQUUsSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFO3dDQUN4QixJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7d0NBQ3ZCLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt3Q0FDbkMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztxQ0FDeEM7b0NBQ0QsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztvQ0FDdkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDO29DQUNsQixJQUFHLEtBQUssQ0FBQyxNQUFNLElBQUksSUFBSTt3Q0FBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUM7O3dDQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO29DQUNwRixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUM7b0NBQ2xCLElBQUcsS0FBSyxJQUFJLElBQUk7d0NBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDOzt3Q0FBTSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDO29DQUN0RSxNQUFNO2dDQUNQO29DQUNDLElBQUcsSUFBSSxDQUFDLFFBQVE7d0NBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQ0FDbkMsSUFBRyxDQUFDLENBQUMsV0FBVyxJQUFJLElBQUksRUFBRTt3Q0FDekIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDO3dDQUNsQixJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3Q0FDM0MsSUFBRyxJQUFJLENBQUMsUUFBUTs0Q0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxD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RUFBRSxDQUFDO29CQUNYLEtBQUssR0FBRzt3QkFDUCxJQUFJLENBQUMsQ0FBQzt3QkFDTixJQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTs0QkFDM1gsSUFBSSxFQUFFLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFDLElBQUksQ0FBQyxHQUFHLEVBQUMsRUFBRSxDQUFDLENBQUM7NEJBQ2xELENBQUMsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDOzRCQUM1QixJQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQzt5QkFDZjs2QkFBTTs0QkFDTixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7NEJBQ3pCLElBQUksRUFBRSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7NEJBQ3BCLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ2QsQ0FBQyxHQUFHLEVBQUUsQ0FBQzt5QkFDUDt3QkFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDbkIsT0FBTyxDQUFDLENBQUM7b0JBQ1YsS0FBSyxHQUFHO3dCQUNQLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQzt3QkFDN0IsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQzt3QkFDcEIsSUFBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSTs0QkFBRSxNQUFNLElBQUksbUJBQW1CLENBQUMsc0JBQXNCLENBQUMsQ0FBQzt3QkFDdEgsSUFBSSxLQUFLLEdBQUcsaUJBQWlCLENBQUMsS0FBSyxDQUFDO3dCQUNwQyxJQUFHLEtBQUssSUFBSSxJQUFJLEVBQUU7NEJBQ2pCLEtBQUssR0FBRyxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsQ0FBQzs0QkFDdEMsaUJBQWlCLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzt5QkFDaEM7d0JBQ0QsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQzt3QkFDbEIsSUFBSSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQzt3QkFDcEIsSUFBSSxJQUFJLENBQUM7d0JBQ1QsSUFBSSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUEsQ0FBQyxDQUFBLElBQUksR0FBRyxDQUFDLENBQUEsQ0FBQyxDQUFBLENBQUMsQ0FBQyxDQUFDO3dCQUNoRCxJQUFJLEdBQUcsR0FBRyxFQUFFLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUM7d0JBQzdCLElBQUksS0FBSyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ3RDLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQzt3QkFDYixPQUFNLEVBQUUsR0FBRyxHQUFHLEVBQUU7NEJBQ2YsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFDbkQsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFDbEQsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQzs0QkFDckMsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFDbEQsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQzs0QkFDcEMsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFDbEQsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO3lCQUMvQjt3QkFDRCxJQUFHLElBQUksSUFBSSxDQUFDLEVBQUU7NEJBQ2IsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFDLEVB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QUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0IsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQixJQUFJLEVBQUUsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQztZQUNqQyxJQUFJLEVBQUUsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQztZQUNqQyxJQUFJLEVBQUUsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQztZQUNqQyxJQUFJLENBQUMsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsRUFBRSxDQUFDLEVBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25HLElBQUksRUFBRSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDNUQsSUFBSSxFQUFFLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM1RCxJQUFJLEVBQUUsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRSxF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S0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFO3dCQUMxQixDQUFDLElBQUksRUFBRSxDQUFDO3dCQUNSLFNBQVM7cUJBQ1Q7b0JBQ0QsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUM1QixFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDZixFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNYLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNmLEVBQUUsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ25CLEVBQUUsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ25CLENBQUMsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUM1SCxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFD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SUFBSSxFQUFDLFNBQVM7WUFDMUUsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNoQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEUsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9ELElBQUksR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvRyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMs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YSxPQUFPLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLE9BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDakwsSUFBSSxFQUFFLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQztRQUNqQixTQUFTLEtBQUssQ0FBQyxDQUFDLEVBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUk7WUFBRyxPQUFPLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSSxJQUFJO1lBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsY0FBYyxJQUFJLElBQUk7WUFBRyxDQUFDLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQzs7WUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUc7WUFBRSxDQUFDLEdBQUcsY0FBWSxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztZQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdlYsVUFBVSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDdkIsTUFB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Q0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxDQUFDLENBQUM7UUFDeDFZLGlCQUFpQixDQUFDLE9BQU8sR0FBRyxDQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsQ0FBQyxHQUFHLEVBQUMsR0FBRyxDQUFDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxFQUFDLENBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLEVBQUMsMENBQTBDLENBQUMsRUFBQyxDQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxFQUFDLDBDQUEwQyxDQUFDLEVBQUMsQ0FBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsRUFBQywwQ0FBMEMsQ0FBQyxDQUFDLENBQUM7UUFDN2paLG1CQUFtQixDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7UUFDaEMsbUJBQW1CLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNsQyxtQkFBbUIsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ2xDLDBCQUEwQixDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7UUFDcEMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2pCLENBQUMsQ0FBQyxDQUFDLE9BQU8sT0FBTyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFDLEdBQUcsRUFBQyxjQUFXLENBQUMsRUFBQyxFQUFFLElBQUksRUFBRSxPQUFPLE1BQU0sSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxNQUFNLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUc3TCxPQUFPLElBQUksQ0FBQztBQUVoQixDQUFDLENBQUMsQ0FBQyJ9