<template>
  <InstancedMesh
    ref="imesh"
    :count="NUM_INSTANCES"
    :position="{ x: 0, y: 0, z: 0 }"
    :rotation="{ x: -Math.PI / 2, y: 0, z: Math.PI / 2 }"
  >
    <BoxGeometry :width="50" :height="1" :depth="1" />
    <PhongMaterial :props="{ color: '#fff', opacity: 1, emissive: '#fff', emissiveIntensity: 1, fog: true }" />
  </InstancedMesh>
</template>

<script setup>
import { onMounted, ref, defineProps, watch } from "vue";
import { Object3D, MathUtils } from "three";
import { useValuesStore } from "@/stores/values.js";
import { PhongMaterial } from "troisjs";

const imesh = ref(null);
let imeshMesh;
const dummy = new Object3D();
const { randFloat: rnd, randFloatSpread: rndFS } = MathUtils;
const valuesStore = useValuesStore();

const NUM_INSTANCES = 50;
const TIMER = ref(0);
const randomValues = ref([]);
const SIZE = 10,
  PADDING = 0.5;
let NY = 150;
let NX = 100;
const SIZEP = SIZE + PADDING;
const W = NX * SIZEP - PADDING;

const props = defineProps({
  render: Object,
  isRender: Boolean
});

onMounted(() => {
  updateValues();
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

const updateValues = () => {
  let newValues = [];
  for (let i = 0; i < NUM_INSTANCES; i++) {
    newValues.push({
      x: rnd(50, 300),
      y: Math.random() < 0.5 ? rnd(-200, -50) : rnd(120, 200),
      z: rnd(50, 400),
    });
  }
  randomValues.value = newValues;
};

const updateInstanceMatrix = () => {
  let x, curX;
  for (let i = 0; i < NUM_INSTANCES; i++) {
    const x0 = -W / 2;
    curX = (TIMER.value - randomValues.value[i].x) * valuesStore.speedParticles;

    const cycleOffset = Math.floor(curX / W) + 1;
    const newPosition = -curX + W * cycleOffset;

    dummy.position.set(
      x0 + newPosition,
      randomValues.value[i].y,
      randomValues.value[i].z
    );

    dummy.updateMatrix();
    imeshMesh.setMatrixAt(i, dummy.matrix);
  }
  imeshMesh.instanceMatrix.needsUpdate = true;
};
</script>

<style lang="scss" scoped></style>
