<template>
  <div class="load">
    <div class="load-box">
      <p class="load-text">GEMINI</p>
    </div>
    <div class="load-progress">
      <p class="load-progress__text">NOW LOADING</p>
      <i-svg-spinners:3-dots-fade class="load-progress__spinner" />
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.load {
  background-color: #262829;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  &-box{
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    &__loading{
      font-size: 20px;
    }
  }
  &-text {
    font-size: 30px;
    font-weight: 500;
    letter-spacing: 4px;
  }
  &-progress {
    position: absolute;
    bottom: 40px;
    display: flex;
    align-items: flex-end;
    gap: 10px;
    &__text {
      font-size: 10px;
      line-height: 1.5;
      letter-spacing: 1px;
    }
    &__spinner {
      font-size: 8px;
    }
  }
}
</style>
