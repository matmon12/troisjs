<template>
  <GltfModel
    ref="car"
    src="./bronco/scene.gltf"
    @load="onReady"
    @progress="onProgress"
    @error="onError"
  />
</template>

<script setup>
import { ref, onMounted, defineProps, render, defineEmits, watch } from "vue";
import { AnimationMixer, Clock, Color, MeshBasicMaterial, sRGBEncoding } from "three";
import { useModelStore } from "@/stores/model";
import { useValuesStore } from "@/stores/values.js";

const car = ref(null);
let mixer;
const clock = ref(null);
const darkMaterial = new Color(0, 0, 0);
const emit = defineEmits();
const modelStore = useModelStore();
const valuesStore = useValuesStore();

const props = defineProps({
  render: Object,
  bloomComposer: Object,
  finalComposer: Object,
  isRender: Boolean,
});

onMounted(() => {
  car.value.position.z = 0;
  car.value.position.x = 0;
  car.value.position.y = 4;

  car.value.rotation.x = 0;
  car.value.rotation.y = 0;
  car.value.rotation.z = 0;
});

const onProgress = (event) => {
  modelStore.loadingCar = true;
};

watch(
  () => props.isRender,
  (newValue, oldValue) => {
    if (newValue) {
      props.render.onBeforeRender(updateMixer);
      props.render.offAfterRender(animate2);
      // colors
      car.value.o3d.children[0].traverse((child) => {
        if (child.isMesh) {
          if (child.name === "polySurface2_tyres1_0") {
            child.material.color = new Color(0xcbcbcb);
          }
          if (child.name === "add_ons_add_ons1_0") {
            child.material.color = new Color(0xf3f3f3);
          }
          if (child.name === "fremes_outer_glass_frem_0") {
            child.material.color = new Color(0xf3f3f3);
          }
          if (child.name === "interior1_interior_color_0") {
            child.material.color = new Color(0xf3f3f3);
          }
          if (child.name === "lover_lover_color_0") {
            child.material.color = new Color(0xf3f3f3);
          }
          if (child.name === "mashine_mashine1_0") {
            child.material.color = new Color(0xe7e7e7);
          }
          if (child.name === "main_color1_main_color_0") {
            child.material.color = new Color(0xffffff);
          }
        }
      });
    } else {
      props.render.offBeforeRender(updateMixer);
      props.render.onAfterRender(animate2);
      // окрас машины
      car.value.o3d.children[0].traverse((child) => {
        if (child.isMesh) {
          if (child.name === "polySurface2_tyres1_0") {
            child.material.color = new Color(0x2c2c2c);
          }
          if (child.name === "add_ons_add_ons1_0") {
            child.material.color = new Color(0x2c2c2c);
          }
          if (child.name === "fremes_outer_glass_frem_0") {
            child.material.color = new Color(0x555555);
          }
          if (child.name === "interior1_interior_color_0") {
            child.material.color = new Color(0x2c2c2c);
          }
          if (child.name === "lover_lover_color_0") {
            child.material.color = new Color(0x555555);
          }
          if (child.name === "mashine_mashine1_0") {
            child.material.color = new Color(0x555555);
          }
        }
      });
    }
  }
);

const onReady = (object) => {
  mixer = new AnimationMixer(object.scene);
  const action = mixer.clipAction(object.animations[0]);
  action.play();

  object.scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
    }
  });

  clock.value = new Clock();
  props.render.onBeforeRender(updateMixer);

  modelStore.loadingCar = false;
};

const onError = () => {};

const animate2 = () => {
  car.value.o3d.children[0].traverse((child) => {
    if (child.isMesh) {
      if (child.name === "main_color1_main_color_0") {
        child.material.color = darkMaterial;
      }
    }
  });
  props.bloomComposer.render();
  car.value.o3d.children[0].traverse((child, index) => {
    if (child.isMesh) {
      if (child.name === "main_color1_main_color_0") {
        child.material.color = new Color(modelStore.colorCar);
      }
    }
  });
  props.finalComposer.render();
};

const updateMixer = () => {
  mixer.update(valuesStore.speedCar);
};
</script>

<style lang="scss" scoped>
body {
  color: rgb(0.6, 0.6, 0.6);
}
</style>
