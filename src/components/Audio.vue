<template>
  <Button @click="isFirstClick ? null : audioPlayAndPause()" class="header-btn-music" @mousedown.stop>
    <div class="lines" :class="{ 'is-pause': !audioStore.isPlaying }">
      <div class="line" :ref="lines[0]" style="transform: scaleY(0.2)"></div>
      <div class="line" :ref="lines[1]" style="transform: scaleY(0.2)"></div>
      <div class="line" :ref="lines[2]" style="transform: scaleY(0.2)"></div>
      <div class="line" :ref="lines[3]" style="transform: scaleY(0.2)"></div>
    </div>
  </Button>
</template>

<script setup>
import { ref, onBeforeUnmount, onMounted, watch, inject } from "vue";
import SvgSpinnersBarsScaleMiddle from "~icons/svg-spinners/bars-scale-middle";
import { useAudioStore } from "@/stores/audio.js";
import { useDocumentVisibility } from "@vueuse/core";
import { Easing } from "@tweenjs/tween.js";

const { anime } = inject("plugins");
const lines = [ref(null), ref(null), ref(null), ref(null)];

const visibility = useDocumentVisibility();
const audioStore = useAudioStore();
let fadeOutInterval, fadeInInterval;
let api = false;
let isFirstClick = true;
let animationLines = [null, null, null, null];

const audioObj = new Audio("./audio/background.mp3");
audioObj.volume = 0.8;
audioObj.loop = true;

onMounted(() => {
  document.addEventListener("click", () => {
    if (isFirstClick) {
      isFirstClick = false;

      audioObj.play();
      audioStore.isPlaying = true;

      // audioContext
      let a = new AudioContext();
      audioStore.pt = [
        a.createMediaElementSource(audioObj),
        a.createBiquadFilter(),
        a.destination,
      ];
      audioStore.pt[1].frequency.value = 10000;
      audioStore.pt[1].Q.value = 0.5;
      audioStore.pt[1].type = "lowpass";
      for (let i = 0; i < 2; i++) {
        audioStore.pt[i].connect(audioStore.pt[i + 1]);
      }

      // анимация линий кнопки
      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          animationLines[i] = anime({
            targets: lines[i].value,
            scaleY: 1,
            duration: 400,
            direction: "alternate",
            loop: true,
            easing: "linear",
          });
        }, i * 200);
      }
    }
  });
});

// паузы музыки при покидании страницы
watch(
  () => visibility.value,
  (newValue, oldValue) => {
    if (newValue === "hidden") {
      audioObj.pause();
    } else {
      if (audioStore.isPlaying) {
        audioObj.play();
      }
    }
  }
);

const decreaseVolume = () => {
  let currentVolume = audioObj.volume;
  if (currentVolume > 0) {
    audioObj.volume = Math.max(0, currentVolume - 0.1);
  } else {
    clearInterval(fadeOutInterval);
    audioObj.pause();
  }
};

const increaseVolume = () => {
  let currentVolume = audioObj.volume;
  if (currentVolume < 0.8) {
    audioObj.volume = Math.min(0.8, currentVolume + 0.1);
  } else {
    clearInterval(fadeInInterval);
  }
};

const audioPlayAndPause = () => {
  audioStore.isPlaying = !audioStore.isPlaying;

  if (audioStore.isPlaying) {
    audioObj.play();
    clearInterval(fadeOutInterval);
    fadeInInterval = setInterval(increaseVolume, 100);

    for (let i = 0; i < 4; i++) {
      animationLines[i].play();
    }
  } else {
    clearInterval(fadeInInterval);
    fadeOutInterval = setInterval(decreaseVolume, 100);

    for (let i = 0; i < 4; i++) {
      animationLines[i].pause();
      lines[i].value.style.transform = "scaleY(0.2)";
    }
  }
};
</script>

<style lang="scss" scoped>
.lines {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 15px;
  &.is-pause {
    .line {
      transition: all 0.6s;
    }
  }
}
.line {
  width: 1px;
  height: 100%;
  background-color: #fff;
  will-change: transform;
  transform-origin: center bottom;
}
</style>
