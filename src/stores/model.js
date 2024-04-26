import {ref} from 'vue';
import { defineStore } from 'pinia';

export const useModelStore = defineStore('model', () => {
  const loadingCar = ref(false);
  const errorCar = ref(null);
  const colorCar = ref(0x00ff95);
  const colorBack = ref('#332d68');
  const colorAnimal = ref('#f3f4ff');
  return {
    loadingCar,
    errorCar,
    colorCar,
    colorBack,
    colorAnimal
  }
})