<template>
  <div class="color">
    <div class="color__inner" v-auto-animate>
      <button
        class="color-btn"
        v-if="isRender"
        v-for="(item, id) in colorsFirstScene"
        :key="id"
        :style="{
          background: `linear-gradient(139deg, ${item.gradient1} 0%, ${item.gradient2} 0%, ${item.gradient3} 100%)`,
        }"
        @click="onClickChange(item, id)"
        :class="{ 'is-active': id === firstColorId }"
      ></button>
      <button
        class="color-btn"
        v-else
        v-for="(item, index) in colorsSecondScene"
        :key="index"
        :style="{ background: `linear-gradient(126deg, ${item.gradient1} 0%, ${item.gradient2} 100%)` }"
        @click="onClickChange(item, index)"
        :class="{ 'is-active': index === secondColorId }"
      ></button>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, ref, defineProps } from "vue";
import { useModelStore } from "@/stores/model";

const modelStore = useModelStore();  
const emit = defineEmits();
const firstColorId = ref(2);
const secondColorId = ref(5);
const colorsFirstScene = [
  {
    gradient1: "#93ff95",
    gradient2: "#67dfb5",
    gradient3: "#027154",
    colorBack: "#1e4d3f",
    colorLight: "#30455c",
    colorAnimal: "#ffffff",
  },
  {
    gradient1: "#93f2ff",
    gradient2: "#69b7c8",
    gradient3: "#025e81",
    colorBack: "#1e4a4d",
    colorLight: "#5a5a5a",
    colorAnimal: "#f3f4ff",
  },
  {
    gradient1: "#93c8ff",
    gradient2: "#6788df",
    gradient3: "#15009d",
    colorBack: "#332d68",
    colorLight: "#5c3053",
    colorAnimal: "#f3f4ff",
  },
  {
    gradient1: "#fff793",
    gradient2: "#c98671",
    gradient3: "#622606",
    colorBack: "#71390b",
    colorLight: "#5c4d30",
    colorAnimal: "#ffd3d3",
  },
  {
    gradient1: "#ff9393",
    gradient2: "#df6767",
    gradient3: "#691a1a",
    colorBack: "#752d2d",
    colorLight: "#5c303a",
    colorAnimal: "#ffffff",
  },
  {
    gradient1: "#ff93e5",
    gradient2: "#c165aa",
    gradient3: "#5f0b71",
    colorBack: "#331e4d",
    colorLight: "#4e305c",
    colorAnimal: "#f3f4ff",
  },
  {
    gradient1: "#aaaaaa",
    gradient2: "#838383",
    gradient3: "#000000",
    colorBack: "#272727",
    colorLight: "#5a5a5a",
    colorAnimal: "#ffc400",
  },
];
const colorsSecondScene = [
  { gradient1: "#ffffff", gradient2: "#adadad", colorCar: "#ffffff" },
  { gradient1: "#060606", gradient2: "#3b3131", colorCar: "#000000" },
  { gradient1: "#ae00ff", gradient2: "#d069ff", colorCar: "#d069ff" },
  { gradient1: "#ff0000", gradient2: "#ff7171", colorCar: "#ff6969" },
  { gradient1: "#ffa000", gradient2: "#fec567", colorCar: "#ffd000" },
  { gradient1: "#00f0b4", gradient2: "#a3c89f", colorCar: "#00ff95" },
  { gradient1: "#0038ff", gradient2: "#567cff", colorCar: "#0038ff" },
];

const props = defineProps({
  isRender: Boolean,
});

const onClickChange = (item, id) => {
  if (props.isRender) {
    emit("changeColor", item.colorBack, item.colorLight, item.colorAnimal);
    modelStore.colorBack = item.colorBack;
    modelStore.colorAnimal = item.colorAnimal;
    firstColorId.value = id;
  } else {
    modelStore.colorCar = item.colorCar;
    secondColorId.value = id;
  }
};
</script>

<style lang="scss" scoped>
.color {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 40px;
  color: #00f0b4;
  z-index: 100;
  &__inner {
    display: flex;
    gap: 10px;
    background-color: #ffffff27;
    padding: 10px;
  }
}
.color-btn {
  height: 30px;
  width: 30px;
  border-radius: 3px;
  background: linear-gradient(139deg, #ff93e5 0%, #df67c2 30%, #81009d 100%);
}
.is-active {
  border: 2px solid #ffffff;
}
</style>
