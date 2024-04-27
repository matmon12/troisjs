<template>
  <div class="cinematic" ref="cinematic">
    <div class="cinematic-field cinematic-top" ref="fieldTop"></div>
    <div class="cinematic-field cinematic-bottom" ref="fieldBottom"></div>
    <div class="cinematic-wrapper" ref="wrapper">
      <div class="cinematic-line"></div>
      <div class="container">
        <div class="cinematic__header">
          <div class="cinematic__header-top">
            <div class="cinematic__header-top-text">RES</div>
            <div class="cinematic__header-top-text">TRANS > VIEW ON</div>
          </div>
          <div class="cinematic__header-bottom">
            <div class="cinematic__header-bottom-text">IN MOTION VIEW</div>
            <div class="cinematic__header-bottom-icon"></div>
          </div>
        </div>
        <div class="cinematic__footer">
          <div class="cinematic__footer-table">
            <div class="cinematic__footer-name">
              <div class="cinematic__footer-name-text">GEMINI</div>
              <div class="cinematic__footer-name-text">FORMULA</div>
              <div class="cinematic__footer-name-text">REC</div>
            </div>
            <div class="cinematic__footer-value">
              <div class="cinematic__footer-value-text">SPEED</div>
              <div class="cinematic__footer-value-text">EN</div>
              <div class="cinematic__footer-value-text">{{ rec }}</div>
            </div>
          </div>
          <div class="cinematic__footer-bottom">
            <div class="cinematic__gem">
              <p class="cinematic__gem-text">GEM</p>
              <p
                class="cinematic__gem-graphic"
                ref="gem"
                style="transform: scaleX(0)"
              ></p>
              <div class="cinematic__gem-box">
                <p class="cinematic__gem-text">INI</p>
                <p class="cinematic__gem-text">A</p>
                <p class="cinematic__gem-text">ON</p>
              </div>
            </div>
            <div class="cinematic__graphic" ref="graphic" style="transform: scaleX(0)">
              <p class="cinematic__graphic-line"></p>
            </div>
            <div class="cinematic__info">
              <div class="cinematic__info-coord" ref="coord" style="transform: scaleX(0)">
                <p class="cinematic__info-coord-text">C</p>
                <p class="cinematic__info-coord-text">{{ x }}.000</p>
                <p class="cinematic__info-coord-text">{{ y }}.000</p>
              </div>
              <p class="cinematic__info-text">LUSION</p>
            </div>
          </div>
        </div>
      </div>
      <div class="cinematic-line"></div>
    </div>
  </div>
</template>

<script setup>
import * as TWEEN from "@tweenjs/tween.js";
import { ref, onMounted, defineProps, watch, defineEmits, inject } from "vue";
import { useValuesStore } from "@/stores/values.js";
import { useAudioStore } from "@/stores/audio.js";

const { anime } = inject("plugins");

const cinematic = ref(null);
const valuesStore = useValuesStore();
const audioStore = useAudioStore();
const emit = defineEmits();
let mouseClickUp, mouseClickDown, changeAudio;
const x = ref(0);
const y = ref(0);
const rec = ref(0);
const coord = ref(null);
const graphic = ref(null);
const gem = ref(null);
const fieldTop = ref(null);
const fieldBottom = ref(null);
const wrapper = ref(null);

const props = defineProps({
  camera: Object,
  home: Object,
  render: Object,
});

onMounted(() => {});

watch(
  () => props.home,
  (newValue, oldValue) => {
    if (newValue) {
      slowOnClick(newValue);
    }
  }
);

watch(
  () => props.render,
  (newValue, oldValue) => {
    if (newValue) {
      props.render.onBeforeRender(animate);
    }
  }
);

const slowOnClick = (home) => {
  let animationFieldTop, animationFieldBottom, animationWrapper, animationCamera;
  const animationRec = anime({
    targets: rec,
    value: 100,
    round: 100,
    duration: 70000,
    loop: true,
    easing: "linear",
  });

  home.addEventListener("mousedown", () => {
    clearTimeout(mouseClickUp);

    mouseClickDown = setTimeout(() => {
      cinematic.value.classList.add("is-active");
      animationCamera = new TWEEN.Tween(props.camera.camera)
        .to({ fov: 65 }, 500)
        .onUpdate(function () {
          props.camera.camera.updateProjectionMatrix();
        })
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();

      // скорости
      valuesStore.speedField = -1;
      valuesStore.speedAnimal = 0.003;
      valuesStore.speedCar = 0.003;

      // тряска камеры
      emit("updateMoveCamera", false);

      // координаты
      getCoordMouse(true);

      // анимации
      animationRec.play();

      anime({
        targets: coord.value,
        scaleX: 1,
        duration: 300,
        delay: 900,
        easing: "linear",
      });

      anime({
        targets: graphic.value,
        scaleX: 1,
        duration: 300,
        delay: 600,
        easing: "linear",
      });

      anime({
        targets: gem.value,
        scaleX: 1,
        duration: 300,
        delay: 300,
        easing: "linear",
      });

      animationFieldTop = anime({
        targets: fieldTop.value,
        height: "15%",
        duration: 400,
        easing: "easeInOutQuad",
      });

      animationFieldBottom = anime({
        targets: fieldBottom.value,
        height: "15%",
        duration: 400,
        easing: "easeInOutQuad",
      });

      animationWrapper = anime({
        targets: wrapper.value,
        opacity: 1,
        duration: 400,
        easing: "linear",
      });

      // audio
      onEffectAudio();
    }, 300);
  });
  home.addEventListener("mouseup", () => {
    clearTimeout(mouseClickDown);

    animationFieldTop ? animationFieldTop.reverse() : undefined;
    animationFieldBottom ? animationFieldBottom.reverse() : undefined;
    animationWrapper ? animationWrapper.reverse() : undefined;
    animationCamera ? animationCamera.stop() : undefined;

    // камера в нач. сост.
    if (props.camera.camera.fov != 65) {
      new TWEEN.Tween(props.camera.camera)
        .to({ fov: 53 }, 500)
        .onUpdate(function () {
          props.camera.camera.updateProjectionMatrix();
        })
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();
    }

    mouseClickUp = setTimeout(() => {
      cinematic.value.classList.remove("is-active");
      new TWEEN.Tween(props.camera.camera)
        .to({ fov: 53 }, 500)
        .onUpdate(function () {
          props.camera.camera.updateProjectionMatrix();
        })
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();
      valuesStore.speedField = -3;
      valuesStore.speedAnimal = 0.01;
      valuesStore.speedCar = 0.012;
      emit("updateMoveCamera", true);

      getCoordMouse(false);

      animationRec.pause();

      anime({
        targets: coord.value,
        scaleX: 0,
        duration: 300,
        easing: "linear",
      });

      anime({
        targets: graphic.value,
        scaleX: 0,
        duration: 300,
        easing: "linear",
      });

      anime({
        targets: gem.value,
        scaleX: 0,
        duration: 300,
        easing: "linear",
      });

      anime({
        targets: fieldTop.value,
        height: 0,
        duration: 400,
        easing: "easeInOutQuad",
      });
      anime({
        targets: fieldBottom.value,
        height: 0,
        duration: 400,
        easing: "easeInOutQuad",
      });

      anime({
        targets: wrapper.value,
        opacity: 0,
        duration: 400,
        easing: "linear",
      });

      // audio
      offEffectAudio();
    }, 500);
  });
};

const onEffectAudio = () => {
  if (audioStore.isPlaying) {
    clearInterval(changeAudio);
    if(audioStore.pt[1].frequency.value > 5000) {
      audioStore.pt[1].frequency.value = 5000;
    }
    changeAudio = setInterval(() => {
      audioStore.pt[1].frequency.value = Math.max(
        400,
        audioStore.pt[1].frequency.value / 1.2
      );
      if (audioStore.pt[1].frequency.value <= 400) {
        clearInterval(changeAudio);
      }
    }, 50);
  }
};

const offEffectAudio = () => {
  if (audioStore.isPlaying) {
    clearInterval(changeAudio);
    changeAudio = setInterval(() => {
      audioStore.pt[1].frequency.value = Math.min(
        10000,
        audioStore.pt[1].frequency.value * 1.2
      );
      if (audioStore.pt[1].frequency.value >= 10000) {
        clearInterval(changeAudio);
      }
    }, 50);
  }
};

const animate = () => {
  TWEEN.update();
};

const getCoordMouse = (state) => {
  const handleMouseMove = (event) => {
    x.value = event.clientX;
    y.value = event.clientY;
  };

  if (state) {
    document.body.addEventListener("mousemove", handleMouseMove);
  } else {
    document.body.removeEventListener("mousemove", handleMouseMove);
  }
};
</script>

<style lang="scss" scoped>
.cinematic {
  inset: 0;
  position: absolute;
  left: 0;
  pointer-events: none;
  display: flex;
  justify-content: center;
  flex-direction: column;
  z-index: 999;
  &-field {
    background-color: #000;
    width: 100%;
    height: 0;
    position: absolute;
  }
  &-top {
    top: 0;
  }
  &-bottom {
    bottom: 0;
  }
  &.is-active {
    .cinematic {
      // &-wrapper {
      //   opacity: 1;
      // }
      &__header-top-text {
        &:nth-child(2) {
          width: 100%;
        }
      }
      &__graphic {
        transform: scaleX(1);
      }
      &__gem-graphic {
        transform: scaleX(1);
      }
      &__footer-name {
        transform: scaleX(1);
      }
    }
  }
}
.cinematic-line {
  width: 100%;
  height: 2px;
  background-color: #ffffff10;
}
.container {
  padding: 15px 0;
  flex-grow: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.cinematic {
  color: #fff;
  &-wrapper {
    height: 60%;
    display: flex;
    flex-direction: column;
    opacity: 0;
  }
  &__header {
  }

  &__header-top {
    display: flex;
    gap: 40px;
    margin-bottom: 20px;
    width: min-content;
  }

  &__header-top-text {
    font-size: 8px;
    letter-spacing: 0.5px;
    &:nth-child(2) {
      white-space: nowrap;
      width: 0;
      overflow: hidden;
      transition: width 0.9s;
      transition-delay: 0.4s;
    }
  }

  &__header-bottom {
    margin-left: 20px;
    display: flex;
    gap: 20px;
  }

  &__header-bottom-text {
    font-size: 14px;
  }

  &__header-bottom-icon {
    width: 20px;
    height: 20px;
    border: 1px solid #fff;
    position: relative;
    &::before {
      content: "";
      width: 3px;
      height: 3px;
      background-color: #fff;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }

  &__footer {
    margin-top: auto;
  }

  &__footer-table {
    margin-bottom: 30px;
  }

  &__footer-name {
    width: 250px;
    display: flex;
    gap: 20px;
    background-color: #ffffff1f;
    padding: 2px 10px;
    margin-bottom: 12px;
    transition: all 0.4s;
    transition-delay: 0.3s;
    transform: scaleX(0);
    transform-origin: top left;
  }

  &__footer-name-text {
    font-size: 8px;
    letter-spacing: 0.5px;
  }

  &__footer-value {
    display: flex;
    margin-left: 50px;
    gap: 30px;
  }

  &__footer-value-text {
    font-size: 8px;
    letter-spacing: 0.5px;
  }

  &__footer-bottom {
    display: flex;
    align-items: center;
    gap: 100px;
  }

  &__gem {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__gem-text {
    font-size: 8px;
  }

  &__gem-graphic {
    width: 150px;
    height: 2px;
    position: relative;
    background-color: #ffffff77;
    transform-origin: top left;
    &::before {
      content: "";
      position: absolute;
      bottom: 0;
      height: 10px;
      width: 1px;
      right: 25%;
      background-color: #ffffffbe;
    }
    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      height: 7px;
      width: 1px;
      right: 10%;
      background-color: #ffffffbe;
    }
  }

  &__gem-box {
    display: flex;
    .cinematic__gem-text:nth-child(2) {
      margin: 0 20px 0 10px;
    }
  }

  &__graphic {
    flex-grow: 1;
    position: relative;
    transform-origin: top left;
    &::after {
      content: "";
      position: absolute;
      width: 4px;
      height: 4px;
      background-color: #d6d6d6;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
    &::before {
      content: "";
      position: absolute;
      width: 3px;
      height: 3px;
      background-color: #d6d6d6;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  &__graphic-line {
    width: 100%;
    height: 1px;
    background-color: #d6d6d6;
    &::after {
      content: "";
      position: absolute;
      left: 20%;
      bottom: 0;
      height: 15px;
      width: 1px;
      background-color: #d6d6d6;
    }
    &::before {
      content: "";
      position: absolute;
      right: 10%;
      bottom: 0;
      height: 10px;
      width: 1px;
      background-color: #d6d6d6;
    }
  }

  &__info {
    display: flex;
    align-items: center;
    gap: 30px;
  }

  &__info-coord {
    display: flex;
    padding: 4px 10px;
    background-color: #ffffff23;
    height: min-content;
    gap: 15px;
    letter-spacing: 1px;
    width: 160px;
    transform-origin: top left;
  }

  &__info-coord-text {
    font-size: 8px;
  }

  &__info-text {
    font-size: 8px;
  }
}
</style>
