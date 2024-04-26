import { ref } from "vue";
import { defineStore } from "pinia";

export const useCursorStore = defineStore("cursor", () => {

  const hoverOnButton = ref(false);

  const mouseEnter = () => {
    hoverOnButton.value = true;
  }
  
  const mouseLeave = () => {
    hoverOnButton.value = false;
  }
  return { hoverOnButton, mouseEnter, mouseLeave }
})