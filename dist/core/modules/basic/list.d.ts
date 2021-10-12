/**
 * The `list` module has functions for working with lists of items.
 * These functions have no direct link with the model, the are generic functions for manipulating lists.
 * The functions are often used when manipulating lists of IDs of entities in the model.
 * These functions neither make nor modify anything in the model.
 * In addition to these functions, there are also various inline functions available for working with lists.
 * @module
 */
export declare enum _EAddMethod {
    TO_START = "to_start",
    TO_END = "to_end",
    EXTEND_START = "extend_start",
    EXTEND_END = "extend_end",
    SORTED_ALPHA = "alpha_descending",
    SORTED_REV_ALPHA = "alpha_ascending",
    SORTED_NUM = "numeric_descending",
    SORTED_REV_NUM = "numeric_ascending",
    SORTED_ID = "ID_descending",
    SORTED_REV_ID = "ID_ascending"
}
/**
 * Adds an item to a list.
 *
 * @param list List to add the item to.
 * @param item Item to add.
 * @param method Enum, select the method.
 * @returns void
 * @example append = list.Add([1,2,3], 4, 'at_end')
 * @example_info Expected value of list is [1,2,3,4].
 * @example append = list.Add([1,2,3], [4, 5], 'at_end')
 * @example_info Expected value of list is [1,2,3,[4,5]].
 * @example append = list.Add([1,2,3], [4,5], 'extend_end')
 * @example_info Expected value of list is [1,2,3,4,5].
 * @example append = list.Add(["a", "c", "d"], "b", 'alpha_descending')
 * @example_info Expected value of list is ["a", "b", "c", "d"].
 */
export declare function Add(list: any[], item: any | any[], method: _EAddMethod): void;
export declare enum _ERemoveMethod {
    REMOVE_INDEX = "index",
    REMOVE_FIRST_VALUE = "first_value",
    REMOVE_LAST_VALUE = "last_value",
    REMOVE_ALL_VALUES = "all_values"
}
/**
 * Removes items in a list.
 * \n
 * If method is set to 'index', then item should be the index of the item to be replaced.
 * Negative indexes are allowed.
 * If method is not set to 'index', then item should be the value.
 *
 * @param list The list in which to remove items
 * @param item The item to remove, either the index of the item or the value. Negative indexes are allowed.
 * @param method Enum, select the method for removing items from the list.
 * @returns void
 */
export declare function Remove(list: any[], item: any, method: _ERemoveMethod): void;
export declare enum _EReplaceMethod {
    REPLACE_INDEX = "index",
    REPLACE_FIRST_VALUE = "first_value",
    REPLACE_LAST_VALUE = "last_value",
    REPLACE_ALL_VALUES = "all_values"
}
/**
 * Replaces items in a list.
 * \n
 * If method is set to 'index', then old_item should be the index of the item to be replaced. Negative indexes are allowed.
 * If method is not set to 'index', then old_item should be the value.
 *
 * @param list The list in which to replace items
 * @param old_item The old item to replace.
 * @param new_item The new item.
 * @param method Enum, select the method for replacing items in the list.
 * @returns void
 */
export declare function Replace(list: any[], old_item: any, new_item: any, method: _EReplaceMethod): void;
/**
 * Sorts an list, based on the values of the items in the list.
 * \n
 * For alphabetical sort, values are sorted character by character,
 * numbers before upper case alphabets, upper case alphabets before lower case alphabets.
 *
 * @param list List to sort.
 * @param method Enum; specifies the sort method to use.
 * @returns void
 * @example list.Sort(list, 'alpha')
 * @example_info where list = ["1","2","10","Orange","apple"]
 * Expected value of list is ["1","10","2","Orange","apple"].
 * @example list.Sort(list, 'numeric')
 * @example_info where list = [56,6,48]
 * Expected value of list is [6,48,56].
 */
export declare function Sort(list: any[], method: _ESortMethod): void;
export declare enum _ESortMethod {
    REV = "reverse",
    ALPHA = "alpha_descending",
    REV_ALPHA = "alpha_ascending",
    NUM = "numeric_descending",
    REV_NUM = "numeric_ascending",
    ID = "ID_descending",
    REV_ID = "ID_ascending",
    SHIFT = "shift_1",
    REV_SHIFT = "reverse_shift_1",
    RANDOM = "random"
}
/**
 * Removes and inserts items in a list.
 * \n
 * If no items_to_add are specified, then items are only removed.
 * If num_to_remove is 0, then values are only inserted.
 *
 * @param list List to splice.
 * @param index Zero-based index after which to starting removing or inserting items.
 * @param num_to_remove Number of items to remove.
 * @param items_to_insert Optional, list of items to add, or null.
 * @returns void
 * @example result = list.Splice(list1, 1, 3, [2.2, 3.3])
 * @example_info where list1 = [10, 20, 30, 40, 50]
 * Expected value of result is [10, 2.2, 3.3, 50]. New items were added where the items were removed.
 */
export declare function Splice(list: any[], index: number, num_to_remove: number, items_to_insert: any[]): void;
