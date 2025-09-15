/**
 * MetricsCounterPort metrics counter
 */
export interface MetricsCounterPort<
    K extends string,
    T extends Record<K, string>,
> {
    inc(labels: T): void;
}

/**
 * MetricsGaugePort metrics gauge
 */
export interface MetricsGaugePort<
    K extends string,
    T extends Record<K, string>,
> {
    set(value: number, labels: T): void;
}

/**
 * MetricsHistogramPort metrics histogram
 */
export interface MetricsHistogramPort<
    K extends string,
    T extends Record<K, string>,
> {
    observe(value: number, labels: T): void;
}

/**
 * MetricsTimerPort metrics timer
 */
export interface MetricsTimerPort<
    K extends string,
    T extends Record<K, string>,
> {
    start(labels: T): () => void;
}
