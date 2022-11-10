const handle = (entries: IntersectionObserverEntry[], node: { dispatchEvent: (arg0: CustomEvent<unknown>) => void; }) => {
  entries.forEach((entry) => {
    node.dispatchEvent(new CustomEvent("inview", { detail: entry }));
    // node.dispatchEvent(new CustomEvent(entry.isIntersecting ? 'inview' : 'outview', { detail: entry }));
  });
};

export function intersectionAPI(node: Element, options = {}) {
  const observer = new IntersectionObserver((entries) => {
    handle(entries, node), options
  });
  observer.observe(node);
  return {
    destroy() {
      observer.unobserve(node);
    },
  };
}
