import { useMemo } from 'react';

/**
 * Generic hook for filtering a list of items by a search term across
 * one or more string fields, with an optional extra predicate.
 *
 * @param items       The full list of items to filter
 * @param searchTerm  The current search string (case-insensitive)
 * @param searchFields Functions that extract searchable strings from an item
 * @param extraFilter Optional additional predicate applied after search
 */
export function useFilteredItems<T>(
  items: T[],
  searchTerm: string,
  searchFields: Array<(item: T) => string>,
  extraFilter?: (item: T) => boolean
): T[] {
  return useMemo(() => {
    let result = items;

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase().trim();
      result = result.filter(item =>
        searchFields.some(field => field(item).toLowerCase().includes(query))
      );
    }

    if (extraFilter) {
      result = result.filter(extraFilter);
    }

    return result;
  }, [items, searchTerm, searchFields, extraFilter]);
}
