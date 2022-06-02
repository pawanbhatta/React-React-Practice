const axios = require("axios");
const redux = require("redux");
const createStore = redux.createStore;
const bindActionCreators = redux.bindActionCreators;

const applyMiddleware = redux.applyMiddleware;
const { logger } = require("redux-logger");
const thunkMiddleware = require("redux-thunk").default;

const initialState = {
  loading: false,
  users: [],
  error: "",
};

const FETCH_USERS_REQUESTED = "FETCH_USERS_REQUESTED";
const FETCH_USERS_SUCCEDDED = "FETCH_USERS_SUCCEDDED";
const FETCH_USERS_FAILED = "FETCH_USERS_FAILED";

const fetchUsersRequest = () => {
  return { type: FETCH_USERS_REQUESTED };
};

const fetchUsersSuccess = (users) => {
  return {
    type: FETCH_USERS_SUCCEDDED,
    payload: users,
  };
};

const fetchUsersFailed = (error) => {
  return { type: FETCH_USERS_FAILED, payload: error };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS_REQUESTED:
      return {
        ...state,
        loading: true,
      };
    case FETCH_USERS_SUCCEDDED:
      return {
        ...state,
        loading: false,
        users: action.payload,
        error: "",
      };
    case FETCH_USERS_FAILED:
      return {
        ...state,
        loading: false,
        users: [],
        error: action.payload,
      };

    default:
      return state;
  }
};

const store = createStore(reducer, applyMiddleware(logger, thunkMiddleware));

const actions = bindActionCreators(
  {
    fetchUsersFailed,
    fetchUsersRequest,
    fetchUsersSuccess,
  },
  store.dispatch
);

const fetchUsers = () => {
  return async function () {
    actions.fetchUsersRequest();
    try {
      const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/usersssss"
      );
      const users = data.map((u) => u.id);
      actions.fetchUsersSuccess(users);
    } catch (error) {
      actions.fetchUsersFailed(error.message);
    }
  };
};

store.dispatch(fetchUsers());
