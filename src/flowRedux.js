import { createSelector } from 'reselect';

export const DEFAULT_NAME_SPACE = 'flow';
const ACTION_ROOT = 'flow-navigation';
const INITALIZE = `${ACTION_ROOT}/INITALIZE`;
const NEXT = `${ACTION_ROOT}/NEXT`; // TODO DEFAULT_NAMESPACE should be package name instead.
const BACK = `${ACTION_ROOT}/BACK`;
const INJECT = `${ACTION_ROOT}/INJECT`;
const GOTO = `${ACTION_ROOT}/GOTO`;
const RESET = `${ACTION_ROOT}/RESET`;
const CLEAR_INJECTIONS = `${ACTION_ROOT}/CLEAR_INJECTIONS`;

/* ------------- Reducers ------------- */


const injectRoute = (routes, route, index) => {
  const frontArray = routes.slice(0, index);
  const newFrontArray = frontArray.map(item => ({
    ...item,
    currentPosition: -1,
  }));
  const backArray = routes.slice(index, routes.length);
  return [
    ...newFrontArray.concat([{ ...route, injected: true }]).concat(backArray),
  ];
};

function getPosition(index, nextPage) {
  if (index < nextPage) {
    return -1;
  } else if (index === nextPage) {
    return 0;
  }
  return 1;
}

function newRoutes(previousPage, nextPage, routes) {
  const newArray = routes.map((item, index) => ({
    ...item,
    currentPosition: getPosition(index, nextPage),
  }));

  return newArray;
}

function clearInjections(routes, currentPage) {
  const pageNumber = routes.map((item, index) => {
    if (item.injected && item.currentPosition !== 0) {
      if (index <= currentPage) {
        return currentPage - 1;
      }
      return currentPage;
    }
    return null;
  });
  const array = routes.filter(
    (item, index) =>
      index === currentPage || item.currentPosition === 0 || !item.injected,
  );
  return {
    currentPage: pageNumber.filter(item => item !== null)[0] || currentPage,
    routes: array,
  };
}

export function flowNavigationReducer(state = {}, action = {}) {
  switch (action.type) {
    case INITALIZE:
      return {
        currentPage: 0,
        history: [],
        routes: action.payload.routes,
      }
    case NEXT:
      return {
        ...state,
        history: [...state.history, state.currentPage],
        currentPage: state.currentPage + 1,
        routes: newRoutes(
          state.currentPage,
          state.currentPage + 1,
          state.routes,
        ),
      };
    case BACK:
      return {
        history: state.history.slice(0, state.history.length - 1),
        currentPage: state.currentPage - 1,
        routes: newRoutes(
          state.currentPage,
          state.currentPage - 1,
          state.routes,
        ),
      };
    case INJECT:
      return {
        ...state,
        currentPage: state.currentPage + 1,
        history: [...state.history, state.currentPage],
        routes: injectRoute(state.routes, action.payload.route, action.payload.index + 1),
      };
    case GOTO:
      return {
        ...state,
      };
    case RESET:
      return {
        ...state,
        history: [],
        currentPage: 0,
        routes: action.payload.routes,
      };
    case CLEAR_INJECTIONS:
      return {
        ...state,
        ...clearInjections(state.routes, state.currentPage),
      };
    default:
      return state;
  }
}

/* ---------- Selectors -------- */

const createSelectNameSpace = (nameSpace = DEFAULT_NAME_SPACE) => state => state[nameSpace] || {};
export const createSelectCurrentPage = (nameSpace = DEFAULT_NAME_SPACE) =>  createSelector(
  createSelectNameSpace(nameSpace),
  state => state.currentPage || 0,
);
export const createSelectHistory = (nameSpace = DEFAULT_NAME_SPACE) => createSelector(
  createSelectNameSpace(nameSpace),
  state => state.history || {},
);
export const createSelectRoutes = (nameSpace = DEFAULT_NAME_SPACE) => createSelector(
  createSelectNameSpace(nameSpace),
  state => state.routes || [],
);
export const createSelectCurrentRoute = (nameSpace = DEFAULT_NAME_SPACE) => createSelector(
  createSelectNameSpace(nameSpace),
  state => state.routes[state.currentPage],
);

/* --------- Action Creators ------- */
export function flowInitalize(routes) {
  return {
    type: INITALIZE,
    payload: {
      routes
    }
  }
}

export function flowNext() {
  return {
    type: NEXT,
  };
}
export function flowBack() {
  return {
    type: BACK,
  };
}
export function flowReset(routes) {
  return {
    type: RESET,
    payload: {
      routes
    }
  };
}
export function flowInject(route, index) {
  return {
    type: INJECT,
    payload: {
      route,
      index,
    },
  };
}
export function flowGoTo(routeName) {
  return {
    type: GOTO,
    payload: routeName,
  };
}
export function flowClearInjections() {
  return {
    type: CLEAR_INJECTIONS,
  };
}
