import { ref } from "vue";
import { defineStore } from "pinia";

export const useAudioStore = defineStore("audio", () => {
  const isPlaying = ref(false);
  const pt = ref(null);

  return { isPlaying, pt };
});
