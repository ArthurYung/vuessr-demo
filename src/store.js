import Vue from "vue";
import Vuex from "vuex";
import Axios from "axios";

Vue.use(Vuex);

export function createStore() {
  return new Vuex.Store({
    state: {
      fields: [],
      example: "Interface Store"
    },
    actions: {
      fetchItem({ commit }) {
        return Axios.get(
          "http://yapi.gltest.jpushoa.com/mock/15/ssr/api/list"
        ).then(res => {
          commit("SET_FIELDS", res.data.fields);
        });
      }
    },
    mutations: {
      SET_FIELDS(state, fields = []) {
        state.fields = fields;
      }
    }
  });
}
