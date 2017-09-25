import { createSelector } from 'reselect';

export const DEFAULT_NAME_SPACE = 'flow';
export const DEFAULT_FLOW_NAME = 'defaultFlow'
const ACTION_ROOT = 'flow-navigation';
const INITALIZE = `${ACTION_ROOT}/INITALIZE`;
const NEXT = `${ACTION_ROOT}/NEXT`; // TODO DEFAULT_NAMESPACE should be package name instead.
const BACK = `${ACTION_ROOT}/BACK`;
const INJECT = `${ACTION_ROOT}/INJECT`;
const GOTO = `${ACTION_ROOT}/GOTO`;
const RESET = `${ACTION_ROOT}/RESET`;
const CLEAR_INJECTIONS = `${ACTION_ROOT}/CLEAR_INJECTIONS`;
const CLEAR_FORWARD_INJECTIONS = `${ACTION_ROOT}/CLEAR_FORWARD_INJECTIONS`;

/* ------------- Reducers ------------- */


const injectRoute = (routes, route, index) => {
  const frontArray = routes.slice(0, index);
  const newFrontArray = frontArray.map(item => ({
    ...item,
    currentPosition: -1,
  }));
  const backArray = routes.slice(index, routes.length);
  // If route not an Array
  if (!Array.isArray(route)) {
    return [
      ...newFrontArray.concat([{ ...route, injected: true }]).concat(backArray),
    ];
  }

  const newRouteArray = route.map(r => ({
    ...r,
    injected: true
  }))

  // If route is an array of objects
  return [
    ...newFrontArray.concat(newRouteArray).concat(backArray),
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

// Used to remove all injections except if currentPage
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

// Used to remove all injections where index is higher than currentPage
export function clearForwardInjections(routes, currentPage) {
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
      index <= currentPage || item.currentPosition === 0 || item.currentPosition === -1 || !item.injected,
  );
  return {
    currentPage: pageNumber.filter(item => item !== null)[0] || currentPage,
    routes: array,
  };
}

export function flowNavigationReducer(state = {}, action = {}) {

  const currentState = state[(action.payload && action.payload.flowName) || DEFAULT_FLOW_NAME]

  switch (action.type) {
    case INITALIZE:
      return {
        ...state,
        [action.payload.flowName]: {
          currentPage: 0,
          history: [],
          routes: action.payload.routes,
        }
      }
    case NEXT:
      return {
        ...state,
        [action.payload.flowName]: {
          ...currentState,
          history: [...currentState.history, currentState.currentPage],
          currentPage: currentState.currentPage + 1,
          routes: newRoutes(
            currentState.currentPage,
            currentState.currentPage + 1,
            currentState.routes,
          )
        },
      };
    case BACK:
      return {
        ...state,
        [action.payload.flowName]: {
          ...currentState,
          history: currentState.history.slice(0, currentState.history.length - 1),
          currentPage: currentState.currentPage - 1,
          routes: newRoutes(
            currentState.currentPage,
            currentState.currentPage - 1,
            currentState.routes,
          ),
        }
      };
    case INJECT:
      return {
        ...state,
        [action.payload.flowName]: {
          ...currentState,
          currentPage: currentState.currentPage + 1,
          history: [...currentState.history, currentState.currentPage],
          routes: injectRoute(currentState.routes, action.payload.route, action.payload.index + 1),
        }
      };
    case GOTO:
      return {
        ...state,
      };
    case RESET:
      return {
        ...state,
        [action.payload.flowName]: {
          ...currentState,
          history: [],
          currentPage: 0,
          routes: action.payload.routes,
        }
      };
    case CLEAR_INJECTIONS:
      return {
        ...state,
        [action.payload.flowName]: {
          ...currentState,
          ...clearInjections(currentState.routes, currentState.currentPage)
        }
      };
    case CLEAR_FORWARD_INJECTIONS:
      return {
        ...state,
        [action.payload.flowName]: {
          ...currentState,
          ...clearForwardInjections(currentState.routes, currentState.currentPage)
        }
      };
    default:
      return state;
  }
}

/* ---------- Selectors -------- */

const createSelectNameSpace = (nameSpace = DEFAULT_NAME_SPACE) => state => state[nameSpace] || {};

export const createSelectFlow = (flowName = DEFAULT_FLOW_NAME, nameSpace) => createSelector(
  createSelectNameSpace(nameSpace),
  state => state[flowName] || {}
)
export const createSelectCurrentPage = (flowName, nameSpace) =>  createSelector(
  createSelectFlow(flowName, nameSpace),
  state => state.currentPage || 0,
);
export const createSelectHistory = (flowName, nameSpace) => createSelector(
  createSelectFlow(flowName, nameSpace),
  state => state.history || {},
);
export const createSelectRoutes = (flowName, nameSpace) => createSelector(
  createSelectFlow(flowName, nameSpace),
  state => state.routes || [],
);
export const createSelectCurrentRoute = (flowName, nameSpace) => createSelector(
  [
    createSelectCurrentPage(flowName, nameSpace),
    createSelectRoutes(flowName, nameSpace),
  ],
  (currentPage, routes) => routes[currentPage] || {},
);

/* --------- Action Creators ------- */
export function flowInitalize(routes, flowName = DEFAULT_FLOW_NAME) {
  return {
    type: INITALIZE,
    payload: {
      routes,
      flowName
    }
  }
}

export function flowNext(flowName = DEFAULT_FLOW_NAME) {
  return {
    type: NEXT,
    payload: {
      flowName
    }
  };
}
export function flowBack(flowName = DEFAULT_FLOW_NAME) {
  return {
    type: BACK,
    payload: {
      flowName
    }
  };
}
export function flowReset(routes, flowName = DEFAULT_FLOW_NAME) {
  return {
    type: RESET,
    payload: {
      routes,
      flowName
    }
  };
}
export function flowInject(route, index, flowName = DEFAULT_FLOW_NAME) {
  return {
    type: INJECT,
    payload: {
      route,
      index,
      flowName
    },
  };
}
export function flowGoTo(routeName) {
  return {
    type: GOTO,
    payload: {
      routeName
    }
  };
}
export function flowClearInjections(flowName = DEFAULT_FLOW_NAME) {
  return {
    type: CLEAR_INJECTIONS,
    payload: {
      flowName
    }
  };
}
export function flowClearForwardInjections(flowName = DEFAULT_FLOW_NAME) {
  return {
    type: CLEAR_FORWARD_INJECTIONS,
    payload: {
      flowName
    }
  };
}
