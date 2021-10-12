"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remap = void 0;
const _check_inline_args_1 = require("../_check_inline_args");
/**
 * Maps a number from the d1 domain to the d2 domain.
 * @param num
 * @param d1
 * @param d2
 */
function remap(debug, num, d1, d2) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('remap', arguments, 3);
    }
    if (Array.isArray(num)) {
        return num.map(num_val => remap(debug, num_val, d1, d2));
    }
    return (d2[0] +
        (((num - d1[0]) / (d1[1] - d1[0])) * (d2[1] - d2[0])));
}
exports.remap = remap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2FyaXRobWV0aWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29yZS9pbmxpbmUvX2FyaXRobWV0aWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOERBQXFEO0FBRXJEOzs7OztHQUtHO0FBQ0gsU0FBZ0IsS0FBSyxDQUFDLEtBQWMsRUFBRSxHQUFvQixFQUFFLEVBQVksRUFBRSxFQUFZO0lBQ2xGLElBQUksS0FBSyxFQUFFO1FBQ1AsSUFBQSxpQ0FBWSxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDdkM7SUFDRCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFBRSxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQWEsQ0FBQztLQUFFO0lBQ2pHLE9BQU8sQ0FBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ1YsQ0FDSSxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ3RELENBQ0osQ0FBQztBQUNOLENBQUM7QUFWRCxzQkFVQyJ9