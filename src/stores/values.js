import { ref } from "vue";
import { defineStore } from "pinia";

export const useValuesStore = defineStore("values", () => {
  const speedField = -3;
  const speedWaves = 0.0004;
  const speedParticles = -7;
  const speed = 3;
  const speedAnimal = 0.012;
  const speedCar = 0.012;

  return {
    speedField,
    speedWaves,
    speedParticles,
    speed,
    speedAnimal,
    speedCar
  };
});
