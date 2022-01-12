"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapSetMerge = exports.isBBox = exports.isPlane = exports.isRay = exports.isXYZ = exports.getEntTypeStr = exports.cloneDeepMapArr = void 0;
const common_1 = require("./common");
/**
 * Makes a deep clone of map where keys are integers and values are arrays of integers.
 * @param map
 */
function cloneDeepMapArr(map) {
    const new_map = new Map();
    map.forEach((value, key) => {
        new_map.set(key, value.slice());
    });
    return new_map;
}
exports.cloneDeepMapArr = cloneDeepMapArr;
/**
 * Used for error messages
 * @param ent_type_str
 */
function getEntTypeStr(ent_type_str) {
    switch (ent_type_str) {
        case common_1.EEntType.POSI:
            return 'positions';
        case common_1.EEntType.VERT:
            return 'vertices';
        case common_1.EEntType.TRI:
            return 'triangles';
        case common_1.EEntType.EDGE:
            return 'edges';
        case common_1.EEntType.WIRE:
            return 'wires';
        case common_1.EEntType.POINT:
            return 'points';
        case common_1.EEntType.PLINE:
            return 'polylines';
        case common_1.EEntType.PGON:
            return 'polygons';
        case common_1.EEntType.COLL:
            return 'collections';
    }
}
exports.getEntTypeStr = getEntTypeStr;
function isXYZ(data) {
    if (!Array.isArray(data)) {
        return false;
    }
    data = data;
    if (data.length !== 3) {
        return false;
    }
    for (const item of data) {
        if (typeof item !== 'number') {
            return false;
        }
    }
    return true;
}
exports.isXYZ = isXYZ;
function isRay(data) {
    if (!Array.isArray(data)) {
        return false;
    }
    data = data;
    if (data.length !== 2) {
        return false;
    }
    for (const item of data) {
        if (!isXYZ(item)) {
            return false;
        }
    }
    return true;
}
exports.isRay = isRay;
function isPlane(data) {
    if (!Array.isArray(data)) {
        return false;
    }
    data = data;
    if (data.length !== 3) {
        return false;
    }
    for (const item of data) {
        if (!isXYZ(item)) {
            return false;
        }
    }
    return true;
}
exports.isPlane = isPlane;
function isBBox(data) {
    if (!Array.isArray(data)) {
        return false;
    }
    data = data;
    if (data.length !== 4) {
        return false;
    }
    for (const item of data) {
        if (!isXYZ(item)) {
            return false;
        }
    }
    return true;
}
exports.isBBox = isBBox;
function mapSetMerge(source, target, source_keys) {
    if (source_keys !== undefined) {
        for (const source_key of source_keys) {
            const source_set = source.get(source_key);
            if (source_set === undefined) {
                throw new Error('Merging map sets failed.');
            }
            if (target.has(source_key)) {
                const target_set = target.get(source_key);
                source_set.forEach(num => target_set.add(num));
            }
            else {
                target.set(source_key, new Set(source_set));
            }
        }
    }
    else {
        source.forEach((source_set, source_key) => {
            if (target.has(source_key)) {
                const target_set = target.get(source_key);
                source_set.forEach(num => target_set.add(num));
            }
            else {
                target.set(source_key, new Set(source_set)); // deep copy
            }
        });
    }
}
exports.mapSetMerge = mapSetMerge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uX2Z1bmMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWJzL2dlby1pbmZvL2NvbW1vbl9mdW5jLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFvQztBQUVwQzs7O0dBR0c7QUFDSCxTQUFnQixlQUFlLENBQUMsR0FBMEI7SUFDdEQsTUFBTSxPQUFPLEdBQTBCLElBQUksR0FBRyxFQUFFLENBQUM7SUFDakQsR0FBRyxDQUFDLE9BQU8sQ0FBRSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUNwQyxDQUFDLENBQUMsQ0FBQztJQUNILE9BQU8sT0FBTyxDQUFDO0FBQ25CLENBQUM7QUFORCwwQ0FNQztBQUNEOzs7R0FHRztBQUNILFNBQWdCLGFBQWEsQ0FBQyxZQUFzQjtJQUNoRCxRQUFRLFlBQVksRUFBRTtRQUNsQixLQUFLLGlCQUFRLENBQUMsSUFBSTtZQUNkLE9BQU8sV0FBVyxDQUFDO1FBQ3ZCLEtBQUssaUJBQVEsQ0FBQyxJQUFJO1lBQ2QsT0FBTyxVQUFVLENBQUM7UUFDdEIsS0FBSyxpQkFBUSxDQUFDLEdBQUc7WUFDYixPQUFPLFdBQVcsQ0FBQztRQUN2QixLQUFLLGlCQUFRLENBQUMsSUFBSTtZQUNkLE9BQU8sT0FBTyxDQUFDO1FBQ25CLEtBQUssaUJBQVEsQ0FBQyxJQUFJO1lBQ2QsT0FBTyxPQUFPLENBQUM7UUFDbkIsS0FBSyxpQkFBUSxDQUFDLEtBQUs7WUFDZixPQUFPLFFBQVEsQ0FBQztRQUNwQixLQUFLLGlCQUFRLENBQUMsS0FBSztZQUNmLE9BQU8sV0FBVyxDQUFDO1FBQ3ZCLEtBQUssaUJBQVEsQ0FBQyxJQUFJO1lBQ2QsT0FBTyxVQUFVLENBQUM7UUFDdEIsS0FBSyxpQkFBUSxDQUFDLElBQUk7WUFDZCxPQUFPLGFBQWEsQ0FBQztLQUM1QjtB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