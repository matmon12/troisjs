<template>
  <InstancedMesh
    ref="imesh"
    :count="NUM_INSTANCES"
    :position="{ x: 0, y: 0, z: 0 }"
    :rotation="{ x: -Math.PI / 2, z: 0 }"
    receive-shadow
  >
    <BoxGeometry :size="SIZE" />
    <LambertMaterial :color="'#fff'" />
  </InstancedMesh>
</template>

<script setup>
import { onMounted, defineProps, ref, watch } from "vue";
import { createNoise2D } from "simplex-noise";
import { Object3D } from "three";
import { useValuesStore } from "@/stores/values.js";

const SIZE = 10,
  PADDING = 0.5;
let NY = 80;
let NX = 100;
const SIZEP = SIZE + PADDING;
const W = NX * SIZEP - PADDING;
const H = NY * SIZEP - PADDING;
const NUM_INSTANCES = NX * NY;
const TIMER = ref(0);
const valuesStore = useValuesStore();

const dummy = new Object3D();
const imesh = ref(null);
const simplex = createNoise2D();
let imeshMesh;

// расчеты для волн
const x0 = -W / 2 + PADDING; // середина
const y0 = -H / 2 + PADDING;
const noise = 0.003;
const height = 15;
let x, y, nx, ny, rx, ry, curX;

const props = defineProps({
  render: Object,
  isRender: Boolean
});

onMounted(() => {
  imeshMesh = imesh.value.mesh;
  props.render ? props.render.onBeforeRender(animate) : null;
});

watch(
  () => props.render,
  (newValue, oldValue) => {
    if (newValue) {
      props.render.onBeforeRender(animate);
    }
  }
);

watch(
  () => props.isRender,
  (newValue, oldValue) => {
    if (newValue) {
      imeshMesh.visible = true;
      props.render.onBeforeRender(animate);
    } else {
      imeshMesh.visible = false;
      props.render.offBeforeRender(animate);
    }
  }
);
 
const animate = () => {
  TIMER.value++;
  updateInstanceMatrix();
};
let currentTime = Date.now();
const updateInstanceMatrix = () => {
  const time = Date.now() * valuesStore.speedWaves; // скорость волн

  for (let i = 0; i < NX; i++) {
    for (let j = 0; j < NY; j++) {
      x = x0 + i * SIZEP; // координаты кубиков
      y = y0 + j * SIZEP;

      curX = y + TIMER.value * valuesStore.speedField; // движение по оси y

      const cycleOffset = Math.floor(curX / (SIZEP * NY)) + 1;
      const newPosition = -curX + SIZEP * NY * cycleOffset; // переход в начало матрицы

      nx = x * noise; //  для шума
      ny = newPosition * noise;

      const roadWidth = 0.01; // дорога
      const road = Math.max(roadWidth - 1, -Math.cos((x / (W - 0.5)) * Math.PI * 4)) + 1;

      rx = simplex(nx, ny - time) * height; // волны
      rx = Math.max(0, rx);

      const elevation = rx * road * road;

      dummy.position.set(x, y0 + newPosition, elevation);
      dummy.updateMatrix();
      imeshMesh.setMatrixAt(i * NY + j, dummy.matrix);
    }
  }

  imeshMesh.instanceMatrix.needsUpdate = true;
};
</script>

<style></style>
