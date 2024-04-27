<template>
  <Plane
    ref="plane"
    :width="2000"
    :height="2800"
    :rotation="{ x: -Math.PI / 2 }"
    :position="{ x: -20 }"
    receive-shadow
  >
    <StandardMaterial>
      <Texture
        src="./floor2/textures/floortile1_baseColor.webp"
        ref="textureMap"
        name="map"
      />
      <Texture
        src="./floor2/textures/floortile1_normal.webp"
        ref="textureNormal"
        name="normalMap"
      />
      <Texture
        src="./floor2/textures/floortile1_metallicRoughness.webp"
        ref="textureMetall"
        name="roughnessMap"
      />
    </StandardMaterial>
  </Plane>
</template>

<script setup>
import { ref, onMounted, defineProps, watch } from "vue";
import {RepeatWrapping} from 'three';

const plane = ref(null);
const textureMap = ref(null);
const textureNormal = ref(null);
const textureMetall = ref(null);

const props = defineProps({
  isRender: Boolean
})

watch(
  () => props.isRender,
  (newValue, oldValue) => {
    if (newValue) {
      plane.value.mesh.visible = false;
    } else {
      plane.value.mesh.visible = true;
    }
  }
);

onMounted(() => {
  plane.value.scale.x = 100;
  plane.value.scale.y = 100;
  plane.value.scale.z = 100;
  plane.value.position.y = 1;

  plane.value.mesh.visible = false;

  textureMap.value.texture.wrapS = RepeatWrapping;
  textureMap.value.texture.wrapT = RepeatWrapping;
  textureMap.value.texture.repeat.set(10, 15);
  textureMetall.value.texture.wrapS = RepeatWrapping;
  textureMetall.value.texture.wrapT = RepeatWrapping;
  textureMetall.value.texture.repeat.set(10, 15);
  textureNormal.value.texture.wrapS = RepeatWrapping;
  textureNormal.value.texture.wrapT = RepeatWrapping;
  textureNormal.value.texture.repeat.set(10, 15);
});
</script>

<style lang="scss" scoped></style>
