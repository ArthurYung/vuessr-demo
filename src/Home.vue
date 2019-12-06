<template>
  <div>
    <TodoList v-for="(item, idx) in fields" :key="idx" :item="item" />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import TodoList from "./TodoList.vue";

export default {
  components: { TodoList },
  asyncData({ store }) {
    return store.dispatch("fetchItem");
  },
  computed: {
    ...mapState({
      fields: state => state.fields
    })
  }
};
</script>

<style></style>
