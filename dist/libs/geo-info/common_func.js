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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uX2Z1bmMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGlicy9nZW8taW5mby9jb21tb25fZnVuYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBb0M7QUFFcEM7OztHQUdHO0FBQ0gsU0FBZ0IsZUFBZSxDQUFDLEdBQTBCO0lBQ3RELE1BQU0sT0FBTyxHQUEwQixJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQ2pELEdBQUcsQ0FBQyxPQUFPLENBQUUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFDeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDcEMsQ0FBQyxDQUFDLENBQUM7SUFDSCxPQUFPLE9BQU8sQ0FBQztBQUNuQixDQUFDO0FBTkQsMENBTUM7QUFDRDs7O0dBR0c7QUFDSCxTQUFnQixhQUFhLENBQUMsWUFBc0I7SUFDaEQsUUFBUSxZQUFZLEVBQUU7UUFDbEIsS0FBSyxpQkFBUSxDQUFDLElBQUk7WUFDZCxPQUFPLFdBQVcsQ0FBQztRQUN2QixLQUFLLGlCQUFRLENBQUMsSUFBSTtZQUNkLE9BQU8sVUFBVSxDQUFDO1FBQ3RCLEtBQUssaUJBQVEsQ0FBQyxHQUFHO1lBQ2IsT0FBTyxXQUFXLENBQUM7UUFDdkIsS0FBSyxpQkFBUSxDQUFDLElBQUk7WUFDZCxPQUFPLE9BQU8sQ0FBQztRQUNuQixLQUFLLGlCQUFRLENBQUMsSUFBSTtZQUNkLE9BQU8sT0FBTyxDQUFDO1FBQ25CLEtBQUssaUJBQVEsQ0FBQyxLQUFLO1lBQ2YsT0FBTyxRQUFRLENBQUM7UUFDcEIsS0FBSyxpQkFBUSxDQUFDLEtBQUs7WUFDZixPQUFPLFdBQVcsQ0FBQztRQUN2QixLQUFLLGlCQUFRLENBQUMsSUFBSTtZQUNkLE9BQU8sVUFBVSxDQUFDO1FBQ3RCLEtBQUssaUJBQVEsQ0FBQyxJQUFJO1lBQ2QsT0FBTyxhQUFhLENBQUM7S0FD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