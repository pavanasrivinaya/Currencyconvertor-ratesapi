import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    // Rates API
    apiBase: "https://api.exchangeratesapi.io",
    currencyUnits: [],
    currencyFrom: null,
    currencyTo: null,
    amount: null,
    toAmount: null,
    convertValue: null
  },
  getters: {
    getCurrencyUnits(state) {
      return state.currencyUnits;
    },
    getConvertData(state) {
      const {
        amount,
        toAmount,
        convertValue,
        currencyFrom,
        currencyTo
      } = state;

      return {
        amount,
        toAmount,
        convertValue,
        currencyFrom,
        currencyTo
      };
    }
  },
  mutations: {
    ["SET_CURRENCY_UNITS"](state, value) {
      state.currencyUnits = value;
    },
    ["SET_CONVERT_CURRENCY"](
      state,
      { currencyFrom, currencyTo, amount, toAmount, convertValue }
    ) {
      state.currencyFrom = currencyFrom;
      state.currencyTo = currencyTo;
      state.amount = amount;
      state.toAmount = toAmount;
      state.convertValue = convertValue;
    }
  },
  actions: {
    async fetchCurrencyUnits({ commit, state }) {
      try {
        const response = await axios.get(`${state.apiBase}/latest`);
        const data = response.data.rates;
        let currencyUnits = [response.data.base];
        for (let key in data) {
          currencyUnits.push(key);
        }
        commit("SET_CURRENCY_UNITS", currencyUnits);
      } catch (error) {
        console.log(error);
      }
    },

    async fetchConvertCurrency(
      { commit, state },
      { currencyFrom, currencyTo, amount }
    ) {
      try {
        const response = await axios.get(
          `${state.apiBase}/latest?base=${currencyFrom}`
        );
        const toAmount = response.data.rates[currencyTo];
        const convertValue = amount * toAmount;

        commit("SET_CONVERT_CURRENCY", {
          currencyFrom,
          currencyTo,
          amount,
          toAmount,
          convertValue
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
});

export default store;
