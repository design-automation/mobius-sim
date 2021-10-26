import { EEntType } from './common';
/**
 * Makes a deep clone of map where keys are integers and values are arrays of integers.
 * @param map
 */
export function cloneDeepMapArr(map) {
    const new_map = new Map();
    map.forEach((value, key) => {
        new_map.set(key, value.slice());
    });
    return new_map;
}
/**
 * Used for error messages
 * @param ent_type_str
 */
export function getEntTypeStr(ent_type_str) {
    switch (ent_type_str) {
        case EEntType.POSI:
            return 'positions';
        case EEntType.VERT:
            return 'vertices';
        case EEntType.TRI:
            return 'triangles';
        case EEntType.EDGE:
            return 'edges';
        case EEntType.WIRE:
            return 'wires';
        case EEntType.POINT:
            return 'points';
        case EEntType.PLINE:
            return 'polylines';
        case EEntType.PGON:
            return 'polygons';
        case EEntType.COLL:
            return 'collections';
    }
}
export function isXYZ(data) {
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
export function isRay(data) {
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
export function isPlane(data) {
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
export function isBBox(data) {
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
export function mapSetMerge(source, target, source_keys) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uX2Z1bmMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWJzL2dlby1pbmZvL2NvbW1vbl9mdW5jLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFFcEM7OztHQUdHO0FBQ0gsTUFBTSxVQUFVLGVBQWUsQ0FBQyxHQUEwQjtJQUN0RCxNQUFNLE9BQU8sR0FBMEIsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUNqRCxHQUFHLENBQUMsT0FBTyxDQUFFLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ3BDLENBQUMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxPQUFPLENBQUM7QUFDbkIsQ0FBQztBQUNEOzs7R0FHRztBQUNILE1BQU0sVUFBVSxhQUFhLENBQUMsWUFBc0I7SUFDaEQsUUFBUSxZQUFZLEVBQUU7UUFDbEIsS0FBSyxRQUFRLENBQUMsSUFBSTtZQUNkLE9BQU8sV0FBVyxDQUFDO1FBQ3ZCLEtBQUssUUFBUSxDQUFDLElBQUk7WUFDZCxPQUFPLFVBQVUsQ0FBQztRQUN0QixLQUFLLFFBQVEsQ0FBQyxHQUFHO1lBQ2IsT0FBTyxXQUFXLENBQUM7UUFDdkIsS0FBSyxRQUFRLENBQUMsSUFBSTtZQUNkLE9BQU8sT0FBTyxDQUFDO1FBQ25CLEtBQUssUUFBUSxDQUFDLElBQUk7WUFDZCxPQUFPLE9BQU8sQ0FBQztRQUNuQixLQUFLLFFBQVEsQ0FBQyxLQUFLO1lBQ2YsT0FBTyxRQUFRLENBQUM7UUFDcEIsS0FBSyxRQUFRLENBQUMsS0FBSztZQUNmLE9BQU8sV0FBVyxDQUFDO1FBQ3ZCLEtBQUssUUFBUSxDQUFDLElBQUk7WUFDZCxPQUFPLFVBQVUsQ0FBQztRQUN0QixLQUFLLFFBQVEsQ0FBQyxJQUFJO1lBQ2QsT0FBTyxhQUFhLENB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