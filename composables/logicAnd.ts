import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'

/**
 * `AND` conditions for refs.
 *
 * @see https://vueuse.org/logicAnd
 */
export function logicAnd<T>(...args: MaybeRefOrGetter<T>[]): ComputedRef<boolean> {
  return computed(() => args.every(i => Boolean(toValue(i))))
}

// alias
export { logicAnd as and } 