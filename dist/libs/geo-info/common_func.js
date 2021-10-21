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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uX2Z1bmMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGlicy9nZW8taW5mby9jb21tb25fZnVuYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRXBDOzs7R0FHRztBQUNILE1BQU0sVUFBVSxlQUFlLENBQUMsR0FBMEI7SUFDdEQsTUFBTSxPQUFPLEdBQTBCLElBQUksR0FBRyxFQUFFLENBQUM7SUFDakQsR0FBRyxDQUFDLE9BQU8sQ0FBRSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUNwQyxDQUFDLENBQUMsQ0FBQztJQUNILE9BQU8sT0FBTyxDQUFDO0FBQ25CLENBQUM7QUFDRDs7O0dBR0c7QUFDSCxNQUFNLFVBQVUsYUFBYSxDQUFDLFlBQXNCO0lBQ2hELFFBQVEsWUFBWSxFQUFFO1FBQ2xCLEtBQUssUUFBUSxDQUFDLElBQUk7WUFDZCxPQUFPLFdBQVcsQ0FBQztRQUN2QixLQUFLLFFBQVEsQ0FBQyxJQUFJO1lBQ2QsT0FBTyxVQUFVLENBQUM7UUFDdEIsS0FBSyxRQUFRLENBQUMsR0FBRztZQUNiLE9BQU8sV0FBVyxDQUFDO1FBQ3ZCLEtBQUssUUFBUSxDQUFDLElBQUk7WUFDZCxPQUFPLE9BQU8sQ0FBQztRQUNuQixLQUFLLFFBQVEsQ0FBQyxJQUFJO1lBQ2QsT0FBTyxPQUFPLENBQUM7UUFDbkIsS0FBSyxRQUFRLENBQUMsS0FBSztZQUNmLE9BQU8sUUFBUSxDQUFDO1FBQ3BCLEtBQUssUUFBUSxDQUFDLEtBQUs7WUFDZixPQUFPLFdBQVcsQ0FBQztRQUN2QixLQUFLLFFBQVEsQ0FBQyxJQUFJO1lBQ2QsT0FBTyxVQUFVLENBQUM7UUFDdEIsS0FBSyxRQUFRLENBQUMsSUFBSTtZQUNkLE9BQU8s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