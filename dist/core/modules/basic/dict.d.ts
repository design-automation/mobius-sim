/**
 * The `dict` module has functions for working with dictionaries.
 * These functions have no direct link with the model, the are generic functions for manipulating dictionaries.
 * These functions neither make nor modify anything in the model.
 * In addition to these functions, there are also inline functions available for working with dictionaries.
 * @module
 */
/**
 * Adds one or more key-value pairs to a dict. Existing keys with the same name will be overwritten.
 * \n
 * @param dict Dictionary to add the key-value pairs to.
 * @param keys A key or list of keys.
 * @param values A value of list of values.
 * @returns void
 */
export declare function Add(dict: object, keys: string | string[], values: any | any[]): void;
/**
 * Removes keys from a dict. If the key does not exist, no action is taken and no error is thrown.
 * \n
 * @param dict The dict in which to remove keys
 * @param keys The key or list of keys to remove.
 * @returns void
 */
export declare function Remove(dict: object, keys: string | string[]): void;
/**
 * Replaces keys in a dict. If the key does not exist, no action is taken and no error is thrown.
 * \n
 * @param dict The dict in which to replace keys
 * @param old_keys The old key or list of keys.
 * @param new_keys The new key or list of keys.
 * @returns void
 */
export declare function Replace(dict: object, old_keys: string | string[], new_keys: string | string[]): void;
