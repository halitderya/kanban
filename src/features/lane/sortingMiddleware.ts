import { Middleware, Action, isPlainObject } from '@reduxjs/toolkit';

interface Lane {
  id: string;
  order: number;
}

interface SortableAction extends Action<string> {
  payload: { [key: string]: Lane };
}

export const sortMiddleware: Middleware = (store) => (next) => (action) => {
  if (isPlainObject(action) && (action as SortableAction).type === 'data/fetchAllLanes/fulfilled') {
    const payloadObj = (action as SortableAction).payload;
    if (typeof payloadObj === 'object' && payloadObj !== null) {
      const lanesArray: Lane[] = Object.values(payloadObj);
      const sortedLanes = lanesArray.sort((a, b) => a.order - b.order);
      return next({ ...action, payload: sortedLanes });
    }
  }
  return next(action);
};
