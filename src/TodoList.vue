<template>
  <div class="item-list" @click="handleClick(item)">
    <span>{{ item.city }}</span> | <span>{{ item.name }}</span> |
    <span>{{ item.time }}</span>
  </div>
</template>

<script>
export default {
  props: ["item"],
  methods: {
    handleClick(item) {
      console.log(item);
    }
  }
};
</script>

<style>
.item-list {
  line-height: 30px;
  color: #999;
  font-size: 16px;
}
</style>
