const redux = require("redux");
const createStore = redux.createStore;
const bindActionCreators = redux.bindActionCreators;
const combineReducers = redux.combineReducers;
const produce = require("immer").produce;
const applyMiddleware = redux.applyMiddleware;

const { logger } = require("redux-logger");
// const logger = createLogger();

// const initialState = {
//   noOfCakes: 10,
// };

const initialCakeState = {
  noOfCakes: 10,
};

const initialIceCreamState = {
  noOfIceCreams: 20,
};

const initialUserState = {
  name: "pawan",
  address: {
    city: "Dhangadhi",
  },
};

const CAKE_ORDERED = "CAKE_ORDERED";
const RESTOCK_CAKE = "RESTOCK_CAKE";

const ICECREAM_ORDERED = "ICECREAM_ORDERED";
const RESTOCK_ICECREAM = "RESTOCK_ICECREAM";

const ADDRESS_UPDATED = "ADDRESS_UPDATED";

function orderCake(payload = 1) {
  return {
    type: CAKE_ORDERED,
    payload,
  };
}

function restockCake(payload = 1) {
  return {
    type: RESTOCK_CAKE,
    payload,
  };
}

function orderIceCream(payload = 1) {
  return {
    type: ICECREAM_ORDERED,
    payload,
  };
}

function restockIceCream(payload = 1) {
  return {
    type: RESTOCK_ICECREAM,
    payload,
  };
}

function updateUser(payload) {
  return {
    type: ADDRESS_UPDATED,
    payload,
  };
}

const cakeReducer = (state = initialCakeState, action) => {
  switch (action.type) {
    case CAKE_ORDERED:
      return {
        ...state,
        noOfCakes: state.noOfCakes - action.payload,
      };

    case RESTOCK_CAKE:
      return {
        ...state,
        noOfCakes: state.noOfCakes + action.payload,
      };

    default:
      return state;
  }
};

const iceCreamReducer = (state = initialIceCreamState, action) => {
  switch (action.type) {
    case ICECREAM_ORDERED:
      return {
        ...state,
        noOfIceCreams: state.noOfIceCreams - action.payload,
      };

    case RESTOCK_ICECREAM:
      return {
        ...state,
        noOfIceCreams: state.noOfIceCreams + action.payload,
      };

    default:
      return state;
  }
};
// const reducer = (state = initialState, action) => {
//   switch (action.type) {
//     case CAKE_ORDERED:
//       return {
//         ...state,
//         noOfCakes: state.noOfCakes - action.payload,
//       };

//     case RESTOCK_CAKE:
//       return {
//         ...state,
//         noOfCakes: state.noOfCakes + action.payload,
//       };
//   }
// };

const userReducer = (state = initialUserState, action) => {
  switch (action.type) {
    case ADDRESS_UPDATED:
      //   return {
      //     ...state,
      //     address: {
      //       ...state.address,
      //       city: action.payload.city,
      //     },
      //   };

      return produce(state, (draft) => {
        draft.address.city = action.payload.city;
      });

    default:
      return state;
  }
};

const rootReducer = combineReducers({
  cake: cakeReducer,
  icecream: iceCreamReducer,
  user: userReducer,
});

const store = createStore(rootReducer, applyMiddleware(logger));
console.log("Initial state", store.getState());

const unSubscribe = store.subscribe(() => {});

// =========== without combining the actions =============
// store.dispatch(orderCake(1));
// store.dispatch(orderCake(2));
// store.dispatch(orderCake(3));

// // unSubscribe();

// store.dispatch(restockCake(2));
// store.dispatch(restockCake(2));
// store.dispatch(restockCake(2));

const actions = bindActionCreators(
  { orderCake, restockCake, orderIceCream, restockIceCream, updateUser },
  store.dispatch
);

// ====================== after combining the actions ===============
actions.orderCake(1);
actions.restockCake(5);
actions.orderIceCream(2);
actions.restockIceCream(5);
actions.updateUser({ city: "Kathmandu" });
