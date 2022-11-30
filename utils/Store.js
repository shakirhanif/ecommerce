import { createContext, useReducer } from "react";
import Cokies from "js-cookie";

export const Store = createContext();

const initialState = {
  cart: Cokies.get("cart")
    ? JSON.parse(Cokies.get("cart"))
    : {
        cartItems: [],
      },
};

function reducer(state, action) {
  switch (action.type) {
    case "add_cart_item": {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item.name === newItem.name ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      Cokies.set(
        "cart",
        JSON.stringify({ ...state.cart, cartItems: cartItems })
      );
      return { ...state, cart: { ...state.cart, cartItems: cartItems } };
    }
    case "cart_remove_item": {
      const cartItems = state.cart.cartItems.filter(
        (x) => x.slug !== action.payload.slug
      );
      Cokies.set(
        "cart",
        JSON.stringify({ ...state.cart, cartItems: cartItems })
      );
      return { ...state, cart: { ...state.cart, cartItems: cartItems } };
    }

    default:
      return state;
  }
}

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{children}</Store.Provider>;
};

export default StoreProvider;
