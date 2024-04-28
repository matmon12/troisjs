<template>
  <div class="home" ref="home">
    <div class="container">
      <Header />
      <Colors
        ref="color"
        :is-render="isFirstScene"
        @mouseenter="cursorStore.mouseEnter"
        @mouseleave="cursorStore.mouseLeave"
        @mousedown.stop
        @change-color="
          (colorBackPar, colorLightPar, colorAnimalPar) =>
            changeColor(colorBackPar, colorLightPar, colorAnimalPar)
        "
      />
    </div>
    <Cinematic
      :camera="camera"
      :home="home"
      :render="renderer"
      @update-move-camera="
        (value) => {
          isMoveCamera = value;
        }
      "
    />
    <div class="style" :class="{ 'is-left': !isFirstScene }" @mousedown.stop>
      <button class="style-btn" @click="changeScene">
        <div class="style-btn__inner">
          <p class="style-text">IN {{ isFirstScene ? "STYLE" : "MOTION" }}</p>
          <span class="style-line"></span>
        </div>
      </button>
    </div>
    <div class="transition"></div>

    <Renderer
      ref="renderer"
      :resize="'window'"
      :orbit-ctrl="{ enableDamping: true, target }"
      shadow
      :autoClear="false"
    >
      <Camera
        ref="camera"
        :position="{ x: cameraPosX, y: cameraPosY, z: cameraPosZ }"
        :far="7000"
        :fov="53"
      />

      <Scene ref="scene" :background="colorBack">
        <AmbientLight v-if="isFirstScene" :intensity="0.8" :color="colorLight" />
        <AmbientLight v-else :intensity="0.1" :color="'#fff'" />

        <PointLight
          v-if="isFirstScene"
          :intensity="0.2"
          :color="'#fff'"
          :position="{ x: -40, y: 20, z: 0 }"
        />

        <SpotLight
          :color="'#fff'"
          :intensity="intensityLight"
          :position="{ x: -30, y: 550, z: 0 }"
          :distance="720"
          :decay="0.1"
          :angle="angleLight"
          :penumbra="0.9"
          castShadow
          :shadowMapSize="{ width: 1024, height: 1024 }"
        />

        <SpotLight
          ref="headlight1"
          :color="'#ffc710'"
          :intensity="0.5"
          :position="{ x: -80, y: 100, z: 150 }"
          :distance="500"
          :angle="Math.PI / 3.7"
          :decay="0.4"
          :penumbra="0.2"
        />

        <SpotLight
          ref="headlight2"
          :color="'#ffc710'"
          :intensity="0.5"
          :position="{ x: 30, y: 100, z: 150 }"
          :distance="500"
          :angle="Math.PI / 3.7"
          :decay="0.4"
          :penumbra="0.2"
        />

        <Car
          :render="renderer"
          :bloomComposer="bloomComposer"
          :finalComposer="finalComposer"
          :is-render="isFirstScene"
        />
        <Animal :is-render="isFirstScene" :render="renderer" :color="colorAnimal" />
        <Floor :is-render="isFirstScene" :render="renderer" />
        <Particles :is-render="isFirstScene" :render="renderer" />

        <Tunnel :is-render="isFirstScene" />
        <Plane :is-render="isFirstScene" />

        <EffectComposer>
          <RenderPass />
          <UnrealBloomPass :strength="3" :radius="0.4" :threshold="0.9" />
          <!-- <TiltShiftPass :gradient-radius="500" :start="{ x: 300, y: 0 }" :end="{ x: 500, y: 0 }" /> -->
        </EffectComposer>
      </Scene>
    </Renderer>
  </div>
  <Loading v-if="modelStore.loadingCar" class="loading" />
</template>

<script setup>
import { onMounted, ref, computed, watch, inject } from "vue";
import {
  Object3D,
  Vector3,
  Fog,
  Color,
  Vector2,
  ShaderMaterial,
} from "three";
import { EffectComposer as EffectComposerThree } from "three/examples/jsm/postprocessing/EffectComposer";
import { UnrealBloomPass as UnrealBloomPassThree } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { RenderPass as RenderPassThree } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { useModelStore } from "@/stores/model";
import { useCursorStore } from "@/stores/cursor";

const renderer = ref(null);
const camera = ref(null);
const scene = ref(null);
const headlight1 = ref(null);
const headlight2 = ref(null);
const home = ref(null);
const color = ref(null);
const isMoveCamera = ref(true);
const modelStore = useModelStore();
const cursorStore = useCursorStore();
const { anime } = inject("plugins");

const isFirstScene = ref(true);
const intensityLight = ref(0.7);
const angleLight = ref(Math.PI / 6);

const colorBack = ref("#332d68");
const colorLight = ref("#5c3053");
const colorAnimal = ref("#f3f4ff");
var controls;
var amplitude = 2;
var frequency = 1;
var nearFog = 150;
var farFog = 750;
var cameraPosX = ref(350);
var cameraPosY = 120;
var cameraPosZ = 300;
var bloomComposer, finalComposer, animeTransOne, animeTransTwo; 

const target = new Vector3(0, 300, 0);

const fog = computed(() => {
  return new Fog(new Color(colorBack.value), nearFog, farFog);
});

watch(
  () => isFirstScene.value,
  (newValue, oldValue) => {
    if (newValue) {
      // колебание камеры
      renderer.value.onBeforeRender(animate);
    } else {
      renderer.value.offBeforeRender(animate);
    }
  }
);

onMounted(() => {
  renderer.value.renderer.setPixelRatio(window.devicePixelRatio);
  scene.value.scene.fog = fog.value;

  // направление света фар
  const targetObject1 = new Object3D();
  const targetObject2 = new Object3D();
  targetObject1.position.set(-80, 0, 470);
  targetObject2.position.set(30, 0, 470);
  scene.value.add(targetObject1);
  scene.value.add(targetObject2);
  headlight1.value.light.target = targetObject1;
  headlight2.value.light.target = targetObject2;

  // controls
  controls = renderer.value.three.cameraCtrl;
  controls.enableRotate = true; // Включение вращения
  controls.enablePan = false; // Отключение перемещения
  controls.minPolarAngle = Math.PI / 2.5;
  controls.maxPolarAngle = Math.PI / 2;
  controls.target = new Vector3(0, 100, 0);
  controls.dampingFactor = 0.05;
  controls.rotateSpeed = 0.15;
  controls.minDistance = 400;
  controls.maxDistance = 500;

  // колебание камеры
  renderer.value.onBeforeRender(animate);

  // unrealBloomPass  вторая сцена
  const renderScene = new RenderPassThree(scene.value.scene, camera.value.camera);

  var bloomPass = new UnrealBloomPassThree(
    new Vector2(window.innerWidth, window.innerHeight),
    3,
    0.2,
    0.4
  );
  bloomComposer = new EffectComposerThree(renderer.value.renderer);
  bloomComposer.renderToScreen = false;
  bloomComposer.addPass(renderScene);
  bloomComposer.addPass(bloomPass);

  const finalPass = new ShaderPass(
    new ShaderMaterial({
      uniforms: {
        baseTexture: { value: null },
        bloomTexture: { value: bloomComposer.renderTarget2.texture },
      },
      vertexShader: document.getElementById("vertexshader").textContent,
      fragmentShader: document.getElementById("fragmentshader").textContent,
      defines: {},
    }),
    "baseTexture"
  );
  finalPass.needsSwap = true;

  finalComposer = new EffectComposerThree(renderer.value.renderer);
  finalComposer.addPass(renderScene);
  finalComposer.addPass(finalPass);
});

const animate = () => {
  if (isMoveCamera.value) {
    updateCameraPosition();
  }
};

const updateCameraPosition = () => {
  var time = Date.now() * 0.01;
  var offsetX = Math.cos(time * frequency) * amplitude;
  var offsetY = Math.sin(time * frequency) * amplitude;

  controls.target = new Vector3(0, 100 + offsetX * 2, 0);
};

const changeColor = (colorBackPar, colorLightPar, colorAnimalPar) => {
  colorBack.value = colorBackPar;
  scene.value.scene.fog = fog.value;

  colorLight.value = colorLightPar;
  colorAnimal.value = colorAnimalPar;
};

const changeScene = () => {
  if (isFirstScene.value) {
    animeTransTwo ? animeTransTwo.pause() : undefined;
    animeTransOne = anime({
      targets: ".transition",
      opacity: [0, 1],
      direction: "alternate",
      duration: 800,
      easing: "easeInOutQuad",
    });

    setTimeout(() => {
      isFirstScene.value = false;
      colorBack.value = "#000000";

      // fog
      nearFog = 500;
      farFog = 1000;
      scene.value.scene.fog = fog.value;

      // light
      intensityLight.value = 0.8;
      angleLight.value = Math.PI / 5;

      // camera
      cameraPosX = -200;
      cameraPosY = 100;
      cameraPosZ = 500;
    }, 800);
  } else {
    animeTransOne ? animeTransOne.pause() : undefined;
    animeTransTwo = anime({
      targets: ".transition",
      opacity: [0, 1],
      direction: "alternate",
      duration: 800,
      easing: "easeInOutQuad",
    });

    setTimeout(() => {
      isFirstScene.value = true;
      colorBack.value = modelStore.colorBack;

      // fog
      nearFog = 150;
      farFog = 750;
      scene.value.scene.fog = fog.value;

      // light
      intensityLight.value = 0.7;
      angleLight.value = Math.PI / 6;

      // camera
      cameraPosX = 350;
      cameraPosY = 120;
      cameraPosZ = 300;
    }, 800);
  }
};
</script>

<style scoped lang="scss">
.home {
  background-color: #000;
  position: relative;
}

.loading {
  position: absolute;
  inset: 0;
  z-index: 999;
}

.style {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  &.is-left {
    right: auto;
    left: 0;
    .style-line {
      order: 0;
    }
    .style-text {
      order: 1;
    }
    .style-btn {
      padding-left: 0;
      padding-right: 20px;
    }
  }
}
.style-btn {
  height: 50px;
  padding-left: 20px;
  &__inner {
    display: flex;
    align-items: center;
    gap: 35px;
    transition: gap 0.4s;
  }
  &:hover {
    .style-text {
      color: #fff;
    }
    .style-line {
      width: 30px;
    }
    .style-btn__inner {
      gap: 45px;
    }
  }
}
.style-line {
  transition: width 0.4s;
  display: block;
  width: 70px;
  height: 1px;
  background-color: #cecece;
}
.style-text {
  font-size: 11px;
  color: #cecece;
  font-weight: 700;
  letter-spacing: 0.8px;
  transition: color 0.3s;
}

.transition {
  position: absolute;
  inset: 0;
  background-color: #000;
  z-index: 0;
  opacity: 0;
  pointer-events: none;
}
</style>

<style lang="scss">
canvas{
  width: 100%;
}
</style>
