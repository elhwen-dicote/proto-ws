/**
 * Get an entry for key in map. If entry is not present, creates one with
 * create and set it in the map for key.
 * 
 * @param map Map or WeakMap.
 * @param key key to get.
 * @param create function to create entry if not present.
 * @returns the value got from map, created if needed.
 */
export function getOrCreate<K extends object, V>(
    map: WeakMap<K, V>,
    key: K,
    create: () => V): V;
export function getOrCreate<K, V>(
    map: Map<K, V>,
    key: K,
    create: () => V): V;
export function getOrCreate<V>(map: any, key: any, create: () => V) {
    let value: V;
    if (map.has(key)) {
        value = map.get(key);
    } else {
        map.set(key, (value = create()));
    }
    return value;
}

/**
 * Check if a map has no entry for the key. If no entry is present for this key, one is created
 *  with create and set in the map.
 * If an entry is present, throw the error created with error unless error is null. If error
 * is null no error is thrown and undefined is returned.
 * 
 * @param map Map or WeakMap.
 * @param key key to get.
 * @param create function to create value if not present.
 * @param error function to create error to throw if entry is present. May be null
 * @returns the value set in the map, undefined if an entry was already present for the key and error is null.
 */
export function setIfNotPresent<K extends object, V>(
    map: WeakMap<K, V>,
    key: K,
    create: () => V,
    error: () => Error): V;
export function setIfNotPresent<K, V>(
    map: Map<K, V>,
    key: K,
    create: () => V,
    error: () => Error): V;
export function setIfNotPresent<V>(map: any, key: any, create: () => V, error: () => Error): V | undefined {
    let value: V | undefined;
    const hasKey = map.has(key);
    if (hasKey && error) {
        throw error();
    } else if (!hasKey) {
        value = create();
        map.set(key, value);
    }
    return value;
}
