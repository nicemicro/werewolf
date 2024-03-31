/**
 * @template { {[x: string]: any} } [T=any]
 * @typedef {import('./action').Action<T>} Action */

/**
 *
 * @param {Array<[string | string[] | ((action: Action) => boolean), (action: Action) => void]>} condMap
 * @return {(action: Action) => void}
 */
export function cond(condMap) {
  return (/** @type {Action} */ action) => {
    const tuple = condMap.find((param) => {
      const names = param[0];
      if (typeof names === "function") {
        return names(action);
      }
      if (Array.isArray(names)) {
        return names.some((n) => n === action.type);
      }
      return names === action.type;
    });
    if (tuple) {
      tuple[1](action);
    }
  };
}
