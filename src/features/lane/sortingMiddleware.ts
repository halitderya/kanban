import { Middleware, Action } from '@reduxjs/toolkit';

// Assuming the payload structure for sortable actions
interface SortablePayload {
  order: number;
  [key: string]: any;
}

// Extend the generic Action type for actions with a sortable payload
interface SortableAction extends Action<string> {
  payload: SortablePayload[];
}

// Define the sorting middleware using the recommended UnknownAction or a more generic approach
export const sortMiddleware: Middleware = (store) => (next) => (action) => {
  // First, check if the action conforms to the expected type and structure
  if ((action as SortableAction).type === 'data/fetchAllLanes/fulfilled' && Array.isArray((action as SortableAction).payload)) {
    const isSortable = (action as SortableAction).payload.every(item => typeof item === 'object' && item !== null && 'order' in item);
    if (isSortable) {
      // If the action is confirmed to be sortable, cast it to SortableAction
      const sortableAction = action as SortableAction;
      // Perform the sorting operation
      const sortedData = sortableAction.payload.sort((a, b) => a.order - b.order);
      // Proceed with the sorted payload
      return next({ ...sortableAction, payload: sortedData });
    }
  }
  // For all other actions, just pass them through
  return next(action);
};

// Then, include this middleware in your store configuration as before
