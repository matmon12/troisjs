<template>
  <button class="btn">
    <slot></slot>
  </button>
</template>

<script setup>
import { defineProps } from "vue";

</script>

<style lang="scss" scoped>
.btn{
  color: #fff;
  background-color: #ffffff27;
  font-size: 12px;
  letter-spacing: 2px;
  padding: 0 12px;
  height: 40px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  &::after{
    content: '';
    background-color: #ffffff21;
    height: 100%;
    width: 0;
    position: absolute;
    left: auto;
    right: 0;
    top: 0;
    transition: all .4s;
  }

  &:hover{
    &::after{
      width: 100%;
      left: 0;
      right: auto;
    }
  }
}
</style>
