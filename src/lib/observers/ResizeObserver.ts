type ResizeObserverCallback = (entry: ResizeObserverEntry) => void;

const subscribers = new WeakMap<Element, Set<ResizeObserverCallback>>();

const o = new ResizeObserver((entries) => {
  for (const entry of entries) {
    if (subscribers.has(entry.target)) {
      for (const s of subscribers.get(entry.target)!) {
        s(entry);
      }
    }
  }
});

export function observeResize<T extends Element>(
  target: T,
  cb: ResizeObserverCallback
) {
  if (!subscribers.has(target)) {
    subscribers.set(target, new Set());
    o.observe(target);
  }

  subscribers.get(target)!.add(cb);
}

export function unobserveResize<T extends Element>(
  target: T,
  cb: ResizeObserverCallback
) {
  if (!subscribers.has(target)) return;

  const subs = subscribers.get(target)!;
  subs.delete(cb);

  if (subs.size === 0) {
    o.unobserve(target);
    subscribers.delete(target);
  }
}
