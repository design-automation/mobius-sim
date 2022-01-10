"use strict";
/**
 * A set of static methods for working with arrays of simple types.
 * The arrays can be nested, but they do not contain any objects.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arr = void 0;
class Arr {
    /**
     * Make an array of numbers. All elements in the array will have the same value.
     * @param length The length of the new array. If length is 0, then an empty array is returned.
     * @param value The values in the array.
     * @returns The resulting array.
     */
    static make(length, value) {
        if (length === 0) {
            return [];
        }
        return Array.apply(0, new Array(length)).map((v, i) => value);
    }
    /**
     * Make an array of numbers. All elements in the array will be a numerical sequence, 0, 1, 2, 3....
     * @param length  The length of the new array. If length is 0, then an empty array is returned.
     * @returns The resulting array.
     */
    static makeSeq(length) {
        if (length === 0) {
            return [];
        }
        return Array.apply(0, new Array(length)).map((v, i) => i);
    }
    /**
     * Check if two nD arrays are equal (i.e. that all elements in the array are equal, ===.).
     * If the arrays are unequal in length, false is returned.
     * Elements in the array can have any value.
     * @param arr1 The first value.
     * @param arr2 The second values.
     * @returns True or false.
     */
    static equal(arr1, arr2) {
        if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
            return arr1 === arr2;
        }
        if (arr1.length !== arr2.length) {
            return false;
        }
        for (let i = 0; i < arr1.length; i++) {
            if (!this.equal(arr1[i], arr2[i])) {
                return false;
            }
        }
        return true;
    }
    /**
     * Find the position of the first occurrence of a specified value in an array.
     * The value can be an array (which is not the case for Array.indexOf()).
     * If the value is not found or is undefined, return -1.
     * If the array is null or undefined, return -1.
     * @param value The value, can be a value or a 1D array of values.
     * @returns The index in the array of the first occurance of the value.
     */
    static indexOf(arr, value) {
        if (!Array.isArray(arr)) {
            throw new Error('First argument must be a array.');
        }
        if (!Array.isArray(value)) {
            return arr.indexOf(value);
        }
        for (let i = 0; i < arr.length; i++) {
            if (Array.isArray(arr[i]) && this.equal(value, arr[i])) {
                return i;
            }
        }
        return -1;
    }
    /**
     * Replace all occurrences of a specified value in an array.
     * The input array is changed.
     * The value can be an array.
     * If the value is not found or is undefined, return -1.
     * @param old_value The old value to replace.
     * @param new_value The new value.
     * @param arr The array.
     */
    static replace(arr, old_value, new_value) {
        if (!Array.isArray(arr)) {
            throw new Error('First argument must be a array.');
        }
        for (let i = 0; i < arr.length; i++) {
            if (this.equal(arr[i], old_value)) {
                arr[i] = new_value;
            }
        }
    }
    /**
     * Take an nD array and flattens it.
     * A new array is returned. The input array remains unchanged.
     * For example, [1, 2, [3, 4], [5, 6]] will become [1, 2, 3, 4, 5, 6].
     * If the input array is undefined, an empty array is returned.
     * @param arr The multidimensional array to flatten.
     * @returns A new 1D array.
     */
    static flatten(arr, depth) {
        if (arr === undefined) {
            return [];
        }
        return arr.reduce(function (flat, toFlatten) {
            if (depth === undefined) {
                return flat.concat(Array.isArray(toFlatten) ? Arr.flatten(toFlatten) : toFlatten);
            }
            else {
                return flat.concat((Array.isArray(toFlatten) && (depth !== 0)) ?
                    Arr.flatten(toFlatten, depth - 1) : toFlatten);
            }
        }, []);
    }
    // /**
    //  * Make a copy of an nD array.
    //  * If the input is not an array, then just return the same thing.
    //  * A new array is returned. The input array remains unchanged.
    //  * If the input array is undefined, an empty array is returned.
    //  * If the input is s sparse array, then the output will alos be a sparse array.
    //  * @param arr The nD array to copy.
    //  * @returns The new nD array.
    //  */
    // public static deepCopy(arr: any[]): any[] {
    //     if (arr === undefined) {return []; }
    //     if (!Array.isArray(arr)) {return arr; }
    //     const arr2: any[] = [];
    //     for (let i = 0; i < arr.length; i++) {
    //         if (Array.isArray(arr[i])) {
    //             arr2[i] = (Arr.deepCopy(arr[i]));
    //         } else {
    //             if (arr[i] !== undefined) {
    //                 arr2[i] = (arr[i]);
    //             }
    //         }
    //     }
    //     return arr2;
    // }
    /**
     * Fills an nD array with new values (all the same value).
     * The input array is changed.
     * If the input array is undefined, an empty array is returned.
     * The input can be a sparse array.
     * @param arr The nD array to fill.
     * @param value The value to insert into the array.
     */
    static deepFill(arr, value) {
        if (arr === undefined) {
            return;
        }
        for (let i = 0; i < arr.length; i++) {
            if (Array.isArray(arr[i])) {
                Arr.deepFill(arr[i], value);
            }
            else {
                if (arr[i] !== undefined) {
                    arr[i] = value;
                }
            }
        }
    }
    /**
     * Counts the number of values in an nD array .
     * The input array remains unchanged.
     * If the input array is undefined, 0 is returned.
     * The input can be a sparse array. Undefined values are ignored.
     * For example, for [1, 2, , , 3], the count will be 3.
     * @param arr The nD array to count.
     * @return The number of elements in the nD array.
     */
    static deepCount(arr) {
        if (arr === undefined) {
            return 0;
        }
        let a = 0;
        for (const i in arr) {
            if (Array.isArray(arr[i])) {
                a = a + Arr.deepCount(arr[i]);
            }
            else {
                if (arr[i] !== undefined) {
                    a = a + 1;
                }
            }
        }
        return a;
    }
}
exports.Arr = Arr;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGlicy90cmlhbmd1bGF0ZS9hcnIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7R0FHRzs7O0FBRUgsTUFBYSxHQUFHO0lBQ1o7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQWMsRUFBRSxLQUFVO1FBQ3pDLElBQUksTUFBTSxLQUFLLENBQUMsRUFBRTtZQUFDLE9BQU8sRUFBRSxDQUFDO1NBQUU7UUFDL0IsT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFDRDs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFjO1FBQ2hDLElBQUksTUFBTSxLQUFLLENBQUMsRUFBRTtZQUFDLE9BQU8sRUFBRSxDQUFDO1NBQUU7UUFDL0IsT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFDRDs7Ozs7OztPQU9HO0lBQ0ksTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFTLEVBQUUsSUFBUztRQUNwQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFBQyxPQUFPLElBQUksS0FBSyxJQUFJLENBQUM7U0FBRTtRQUMxRSxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUFDLE9BQU8sS0FBSyxDQUFDO1NB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