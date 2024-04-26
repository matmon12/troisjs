<template>
  <div class="header">
    <div class="container">
      <div class="header__inner">
        <router-link
          to="/troisjs/"
          @mouseenter="cursorStore.mouseEnter"
          @mouseleave="cursorStore.mouseLeave"
          @mousedown.stop
        >
          <div class="logo">
            <p>LOGO :</p>
            <span>LABS</span>
          </div>
        </router-link>

        <div class="header__right">
          <Audio/>
          <Button class="header-btn-about" @mousedown.stop >ABOUT</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCursorStore } from "@/stores/cursor";

const cursorStore = useCursorStore();

</script>

<style lang="scss" scoped>
.header {
  background-color: transparent;
  position: fixed;
  top: 50px;
  left: 0;
  right: 0;
  width: 100%;
  pointer-events: none;
  z-index: 100;
  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__right {
    display: flex;
    gap: 20px;
    pointer-events: all;
  }
}
.header-btn-music {
}
.header-btn-about {
}

.logo {
  display: flex;
  align-items: center;
  padding: 0 15px;
  border-radius: 5px;
  background-color: #ffffff27;
  color: #fff;
  height: 40px;
  font-size: 18px;
  letter-spacing: 2px;
  line-height: 1;
  pointer-events: all;
  span {
    display: block;
    font-family: "Press Start 2P", system-ui;
    margin-left: 5px;
    margin-bottom: -3px;
    font-size: 14px;
    line-height: 1;
  }
}

#paused {
  position: absolute;
  left: 50%;
  margin-left: -50px;
  bottom: 15px;
  color: #811;
  width: 100px;
  text-align: center;
  cursor: pointer;
}
</style>
