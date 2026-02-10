/**
 * Like `Omit`, but preserves discriminated unions.
 *
 * `Omit<A | B, K>` collapses the union first, losing narrowing by discriminant.
 * This distributes over each member: `Omit<A, K> | Omit<B, K>`.
 *
 * @example
 * ```ts
 * type Action = { type: "a"; payload: string } | { type: "b"; count: number };
 * type WithoutPayload = OmitDistributed<Action, "payload">;
 * // => { type: "a" } | { type: "b"; count: number }
 * ```
 */
export type OmitDistributed<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
