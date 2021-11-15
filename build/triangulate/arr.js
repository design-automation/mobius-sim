/**
 * A set of static methods for working with arrays of simple types.
 * The arrays can be nested, but they do not contain any objects.
 */
export class Arr {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGlicy90cmlhbmd1bGF0ZS9hcnIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHO0FBRUgsTUFBTSxPQUFPLEdBQUc7SUFDWjs7Ozs7T0FLRztJQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBYyxFQUFFLEtBQVU7UUFDekMsSUFBSSxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQUMsT0FBTyxFQUFFLENBQUM7U0FBRTtRQUMvQixPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUNEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQWM7UUFDaEMsSUFBSSxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQUMsT0FBTyxFQUFFLENBQUM7U0FBRTtRQUMvQixPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUNEOzs7Ozs7O09BT0c7SUFDSSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQVMsRUFBRSxJQUFTO1FBQ3BDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUFDLE9BQU8sSUFBSSxLQUFLLElBQUksQ0FBQztTQUFFO1FBQzFFLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQUMsT0FBTyxLQUFLLENBQUM7U0FBRTtRQUNqRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNsQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQUMsT0FBTyxLQUFLLENBQUM7YUFBRTtTQUN0RDtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDRDs7Ozs7OztPQU9HO0lBQ0ksTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFVLEVBQUUsS0FBVTtRQUN4QyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsaUNBQWlDLENBQUMsQ0FBQztTQUFFO1FBQy9FLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQUMsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQUU7UUFDeEQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDakMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNwRCxPQUFPLENBQUMsQ0FBQzthQUNaO1NBQ0o7UUFDRCxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ2QsQ0FBQztJQUNEOzs7Ozs7OztPQVFHO0lBQ0ksTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFVLEVBQUUsU0FBYyxFQUFFLFNBQWM7UUFDNUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFBQyxNQUFNLElBQUksS0FBSyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7U0FBRTtRQUMvRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNqQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxFQUFFO2dCQUMvQixHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDO2FBQ3RCO1NBQ0o7SUFDTCxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNJLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBVSxFQUFFLEtBQWM7UUFDNUMsSUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFO1lBQUMsT0FBTyxFQUFFLENBQUM7U0FBRTtRQUNwQyxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBUyxJQUFJLEVBQUUsU0FBUztZQUN0QyxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7Z0JBQ3JCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUNyRjtpQkFBTTtnQkFDSCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDNUQsR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUN0RDtRQUNMLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNYLENBQUM7SUFDRCxNQUFNO0lBQ04saUNBQWlDO0lBQ2pDLG9FQUFvRTtJQUNwRSxpRUFBaUU7SUFDakUsa0VBQWtFO0lBQ2xFLGtGQUFrRjtJQUNsRixzQ0FBc0M7SUFDdEMsZ0NBQWdDO0lBQ2hDLE1BQU07SUFDTiw4Q0FBOEM7SUFDOUMsMkNBQTJDO0lBQzNDLDhDQUE4QztJQUM5Qyw4QkFBOEI7SUFDOUIsNkNBQTZDO0lBQzdDLHVDQUF1QztJQUN2QyxnREFBZ0Q7SUFDaEQsbUJBQW1CO0lBQ25CLDBDQUEwQztJQUMxQyxzQ0FBc0M7SUFDdEMsZ0JBQWdCO0lBQ2hCLFlBQVk7SUFDWixRQUFRO0lBQ1IsbUJBQW1CO0lBQ25CLElBQUk7SUFDSjs7Ozs7OztPQU9HO0lBQ0ksTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFVLEVBQUUsS0FBVTtRQUN6QyxJQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUU7WUFBQyxPQUFPO1NBQUU7UUFDakMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDakMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUN2QixHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzthQUMvQjtpQkFBTTtnQkFDSCxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLEVBQUU7b0JBQ3RCLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7aUJBQ2xCO2FBQ0o7U0FDSjtJQUNMLENBQUM7SUFDRDs7Ozs7Ozs7T0FRRztJQUNJLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBVTtRQUM5QixJQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUU7WUFBQyxPQUFPLENBQUMsQ0FBQztTQUFFO1FBQ25DLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBRTtRQUNYLEtBQU0sTUFBTSxDQUFDLElBQUksR0FBRyxFQUFFO1lBQ2xCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDdkIsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2pDO2lCQUFNO2dCQUNILElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsRUFBRTtvQkFDdEIsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUU7aUJBQ2Q7YUFDSjtTQUNKO1FBQ0QsT0FBTyxDQUFDLENBQUU7SUFDZCxDQUFDO0NBQ0oifQ==