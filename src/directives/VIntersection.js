export default {
  mounted(el, binding) {
    const options = {
      rootMargin: "0px",
      threshold: 0,
    }

    const callback = (entries, observer) => {
      if (entries[0].isIntersecting) {
        binding.value['active']();
        observer.unobserve(el);
      }
    }

    const observer = new IntersectionObserver(callback, options);
    observer.observe(el);
  },
  name: 'intersection'
}