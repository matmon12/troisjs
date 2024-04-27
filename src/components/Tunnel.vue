<template>
  <InstancedMesh ref="imesh" :position="{ x: -20, y: 0 }" :count="NX">
    <TorusGeometry :radius="400" :tube="2" :arc="Math.PI" :tubularSegments="100" />
    <StandardMaterial :color="colorTorus" :props="{ emissive: '#fff', fog: false }" />
  </InstancedMesh>
</template>

<script setup>
import { Object3D } from "three";
import { ref, onMounted, defineProps, watch } from "vue";

const imesh = ref(null);
let imeshMesh;
const colorTorus = ref("#ffffff");

const NX = 15;
const SIZE = 20;
const PADDING = 200;
const SIZEP = SIZE + PADDING;
const W = NX * SIZEP - PADDING;

const props = defineProps({
  isRender: Boolean
})

watch(
  () => props.isRender,
  (newValue, oldValue) => {
    if (newValue) {
      imeshMesh.visible = false;
    } else {
      imeshMesh.visible = true;
    }
  }
);

onMounted(() => {
  imeshMesh = imesh.value.mesh;
  imeshMesh.visible = false;

  const dummy = new Object3D();
  const x0 = -W / 2 + PADDING;
  for (let i = 0; i < NX; i++) {
    const x = x0 + i * SIZEP;
    dummy.position.set(0, 0, x);
    dummy.updateMatrix();
    imeshMesh.setMatrixAt(i, dummy.matrix);
  }
  imeshMesh.instanceMatrix.needsUpdate = true;
});
</script>

<style lang="scss" scoped></style>
