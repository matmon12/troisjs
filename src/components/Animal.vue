<template>
  <GltfModel ref="model" src="./cat/scene.gltf" @load="onReady" />
</template>

<script setup>
import { ref, onMounted, defineProps, computed, watch } from "vue";
import {
  AnimationMixer,
  Clock,
  MeshBasicMaterial,
  Color,
  MeshStandardMaterial,
  MeshPhongMaterial,
} from "three";
import { useValuesStore } from "@/stores/values.js";
import { useModelStore } from "@/stores/model";

const model = ref(null);
let mixer;
const clock = ref(null);
const valuesStore = useValuesStore();
const modelStore = useModelStore();

const props = defineProps({
  render: Object,
  color: String,
  isRender: Boolean,
});

watch(
  () => props.isRender,
  (newValue, oldValue) => {
    if (newValue) {
      model.value.o3d.visible = true;
      changeColor(modelStore.colorAnimal);
      props.render.onBeforeRender(updateMixer);
    } else {
      model.value.o3d.visible = false;
      props.render.offBeforeRender(updateMixer);
    }
  }
);

watch(
  () => props.color,
  (newValue, oldValue) => {
    if (newValue) {
      changeColor(newValue);
    }
  }
);

const changeColor = (color) => {
  const newColor = new Color(color);
  model.value.scene.traverse((child) => {
    if (child.isMesh) {
      if (child.material instanceof MeshPhongMaterial) {
        child.material.emissive = newColor;
      }
    }
  });
};

onMounted(() => {
  model.value.position.x = 110;
  model.value.position.z = -30;

  model.value.rotation.x = 0;
  model.value.rotation.y = 0;

  model.value.scale.x = 1;
  model.value.scale.y = 1;
  model.value.scale.z = 1;
});

const onReady = (object) => {
  mixer = new AnimationMixer(object.scene);
  const action = mixer.clipAction(object.animations[2]);
  action.play();

  object.scene.traverse((child) => {
    if (child.isMesh) {
      const wireframeMaterial = new MeshPhongMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.2,
        emissive: new Color(props.color),
        emissiveIntensity: 1,
        fog: false,
      });
      child.material = wireframeMaterial;
      child.castShadow = true;
    }
  });

  clock.value = new Clock();
  props.render.onBeforeRender(updateMixer);
};

const updateMixer = () => {
  mixer.update(valuesStore.speedAnimal);
};
</script>

<style lang="scss" scoped>
body {
  color: #f3f4ff;
  color: #ff58c7;
}
</style>
