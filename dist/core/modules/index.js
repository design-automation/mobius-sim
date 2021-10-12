"use strict";
// functions used by mobius
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._Output = exports._arithmetic = exports._util = exports._constants = exports._conversion = exports._colors = exports._set = exports._dict = exports._common = exports._list = exports._geometry = exports._plane = exports._ray = exports._vec = exports._rand = exports._strs = exports._types = exports._mathjs = exports._math = exports.util = exports.io = exports.poly2d = exports.intersect = exports.material = exports.visualize = exports.calc = exports.analyze = exports.collection = exports.attrib = exports.edit = exports.modify = exports.make = exports.pattern = exports.query = exports.dict = exports.list = exports._model = void 0;
// import * as Model from './Model';
// export {Model};
const _model = __importStar(require("./_model"));
exports._model = _model;
// import * as _model from './Model';
// export {_model};
// functions for end users
const list = __importStar(require("./basic/list"));
exports.list = list;
const dict = __importStar(require("./basic/dict"));
exports.dict = dict;
const query = __importStar(require("./basic/query"));
exports.query = query;
const pattern = __importStar(require("./basic/pattern"));
exports.pattern = pattern;
const make = __importStar(require("./basic/make"));
exports.make = make;
const modify = __importStar(require("./basic/modify"));
exports.modify = modify;
const edit = __importStar(require("./basic/edit"));
exports.edit = edit;
const attrib = __importStar(require("./basic/attrib"));
exports.attrib = attrib;
const collection = __importStar(require("./basic/collection"));
exports.collection = collection;
const analyze = __importStar(require("./basic/analyze"));
exports.analyze = analyze;
const calc = __importStar(require("./basic/calc"));
exports.calc = calc;
const visualize = __importStar(require("./basic/visualize"));
exports.visualize = visualize;
const material = __importStar(require("./basic/material"));
exports.material = material;
const intersect = __importStar(require("./basic/intersect"));
exports.intersect = intersect;
const poly2d = __importStar(require("./basic/poly2d"));
exports.poly2d = poly2d;
const io = __importStar(require("./basic/io"));
exports.io = io;
const util = __importStar(require("./basic/util"));
exports.util = util;
// helpers
const _math = __importStar(require("../inline/_math"));
exports._math = _math;
const _mathjs = __importStar(require("../inline/_mathjs"));
exports._mathjs = _mathjs;
const _types = __importStar(require("../inline/_types"));
exports._types = _types;
const _strs = __importStar(require("../inline/_strs"));
exports._strs = _strs;
const _rand = __importStar(require("../inline/_rand"));
exports._rand = _rand;
const _vec = __importStar(require("../inline/_vec"));
exports._vec = _vec;
const _ray = __importStar(require("../inline/_ray"));
exports._ray = _ray;
const _plane = __importStar(require("../inline/_plane"));
exports._plane = _plane;
const _geometry = __importStar(require("../inline/_geometry"));
exports._geometry = _geometry;
const _list = __importStar(require("../inline/_list"));
exports._list = _list;
const _common = __importStar(require("../inline/_common"));
exports._common = _common;
const _dict = __importStar(require("../inline/_dict"));
exports._dict = _dict;
const _set = __importStar(require("../inline/_set"));
exports._set = _set;
const _colors = __importStar(require("../inline/_colors"));
exports._colors = _colors;
const _conversion = __importStar(require("../inline/_conversion"));
exports._conversion = _conversion;
const _constants = __importStar(require("../inline/_constants"));
exports._constants = _constants;
const _util = __importStar(require("../inline/_util"));
exports._util = _util;
const _arithmetic = __importStar(require("../inline/_arithmetic"));
exports._arithmetic = _arithmetic;
// input, output ports
const _Output = __importStar(require("./_output"));
exports._Output = _Output;
__exportStar(require("../_parameterTypes"), exports);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29yZS9tb2R1bGVzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwyQkFBMkI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFM0Isb0NBQW9DO0FBQ3BDLGtCQUFrQjtBQUVsQixpREFBbUM7QUFDM0Isd0JBQU07QUFFZCxxQ0FBcUM7QUFDckMsbUJBQW1CO0FBRW5CLDBCQUEwQjtBQUUxQixtREFBcUM7QUFDN0Isb0JBQUk7QUFFWixtREFBcUM7QUFDN0Isb0JBQUk7QUFFWixxREFBdUM7QUFDL0Isc0JBQUs7QUFFYix5REFBMkM7QUFDbkMsMEJBQU87QUFFZixtREFBcUM7QUFDN0Isb0JBQUk7QUFFWix1REFBeUM7QUFDakMsd0JBQU07QUFFZCxtREFBcUM7QUFDN0Isb0JBQUk7QUFFWix1REFBeUM7QUFDakMsd0JBQU07QUFFZCwrREFBaUQ7QUFDekMsZ0NBQVU7QUFFbEIseURBQTJDO0FBQ25DLDBCQUFPO0FBRWYsbURBQXFDO0FBQzdCLG9CQUFJO0FBRVosNkRBQStDO0FBQ3ZDLDhCQUFTO0FBRWpCLDJEQUE2QztBQUNyQyw0QkFBUTtBQUVoQiw2REFBK0M7QUFDdkMsOEJBQVM7QUFFakIsdURBQXlDO0FBQ2pDLHdCQUFNO0FBRWQsK0NBQWlDO0FBQ3pCLGdCQUFFO0FBRVYsbURBQXFDO0FBQzdCLG9CQUFJO0FBSVosVUFBVTtBQUVWLHVEQUF5QztBQUNqQyxzQkFBSztBQUViLDJEQUE2QztBQUNyQywwQkFBTztBQUVmLHlEQUEyQztBQUNuQyx3QkFBTTtBQUVkLHVEQUF5QztBQUNqQyxzQkFBSztBQUViLHVEQUF5QztBQUNqQyxzQkFBSztBQUViLHFEQUF1QztBQUMvQixvQkFBSTtBQUVaLHFEQUF1QztBQUMvQixvQkFBSTtBQUVaLHlEQUEyQztBQUNuQyx3QkFBTTtBQUVkLCtEQUFpRDtBQUN6Qyw4QkFBUztBQUVqQix1REFBeUM7QUFDakMsc0JBQUs7QUFFYiwyREFBNkM7QUFDckMsMEJBQU87QUFFZix1REFBeUM7QUFDakMsc0JBQUs7QUFFYixxREFBdUM7QUFDL0Isb0JBQUk7QUFFWiwyREFBNkM7QUFDckMsMEJBQU87QUFFZixtRUFBcUQ7QUFDN0Msa0NBQVc7QUFFbkIsaUVBQW1EO0FBQzNDLGdDQUFVO0FBRWxCLHVEQUF5QztBQUNqQyxzQkFBSztBQUViLG1FQUFxRDtBQUM3QyxrQ0FBVztBQUVuQixzQkFBc0I7QUFFdEIsbURBQXFDO0FBQzdCLDBCQUFPO0FBRWYscURBQW1DIn0=