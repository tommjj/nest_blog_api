export interface IKVCachePort {
    /**
     * Set stores a value in storage with the key and time-to-live (TTL).
     *
     * @param key - key
     * @param value - value
     * @param ttl - time-to-live
     */
    set(key: string, value: any, ttl: number): Promise<void>;
    /**
     * MSet is like Set but accepts multiple values
     *
     * @param ttl - time-to-live
     * @param kv - key value record
     */
    mset(ttl: number, kv: Record<string, any>): Promise<void>;
    /**
     * SetNX stores a value in storage with the key and time-to-live (TTL) if the key does not exist.
     *
     * @param key - key
     * @param value - value
     * @param ttl - time-to-live
     */
    setNX(key: string, value: any, ttl: number): Promise<void>;
    /**
     * Get retrieves a value from storage by key.
     *
     * @param key - key
     */
    get(key: string): Promise<any>;
    /**
     * MGet retrieves multiple values from storage by keys.
     *
     * @param keys - key
     */
    mget(keys: string[]): Promise<any[]>;
    /**
     * Exists checks if a key exists in storage.
     *
     * @param key - key
     */
    exists(key: string): Promise<boolean>;
    /**
     * DelByPrefix deletes all keys that match the given prefix.
     *
     * @param prefix - prefix
     */
    delByPrefix(prefix: string): Promise<void>;
    /**
     * Del removes a specific key from storage.
     *
     * @param key - key
     */
    del(key: string): Promise<void>;
}
