export function findIndex<T>(currentValue: string, items: T[]) {
  for (let i = 0; i < items.length; i++) {
    const value = JSON.stringify(items[i]);

    if (value === currentValue) {
      return i;
    }
  }

  return -1;
}

export function reorder<T>(dragged: T, dropped: T, items: T[]) {
  const newIndex = findIndex(JSON.stringify(dropped), items);
  const curIndex = findIndex(JSON.stringify(dragged), items);

  if (curIndex == -1 || newIndex == -1) return items;
  items.splice(curIndex, 1);
  items.splice(newIndex, 0, dragged);

  // for (let j = 0; j < items.length; j++) {
  //   items[j].order = j
  // }

  return items;
}
