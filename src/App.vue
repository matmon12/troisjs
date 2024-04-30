<template>
  <main>
    <router-view></router-view>
    <div class="cursor">
      <div class="circle" ref="circle" :class="{'is-hidden' : cursorStore.hoverOnButton}"></div>
      <div class="point" ref="point" :class="{'is-hidden' : cursorStore.hoverOnButton}"></div>
    </div>
  </main>
</template>

<script setup>
import { inject, onMounted, ref } from 'vue';
import { useCursorStore } from '@/stores/cursor';
const {anime} = inject('plugins');


const cursorStore = useCursorStore();
const circle = ref(0);
const point = ref(0);

onMounted(() => {
  moveCursor();
})

const moveCursor = () => {
  document.body.addEventListener('mousemove', (event) => {
    const x = event.clientX;
    const y = event.clientY;

    anime({
      targets: circle.value,
      left: x - 30,
      top: y - 30,
      duration: 1000,
      easing: 'easeOutCirc'
    })

    anime({
      targets: point.value,
      left: x,
      top: y,
      duration: 500,
      easing: 'easeOutCirc' 
    })
  })
}
</script>


<style scoped lang="scss">
.cursor{
  pointer-events: none
}
.circle {
  position: absolute;
  z-index: 900;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 1px solid #fff;
  pointer-events: none;
}
.point {
  position: absolute;
  z-index: 900;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background-color: #fff;
  pointer-events: none;
  
}

.is-hidden{
  opacity: 0;
}
</style>
