import { createMemo } from "solid-js";

export type ClassNameValue =
  | undefined
  | string
  | string[]
  | Record<string, boolean | undefined>;

export function createClassList(...classNames: ClassNameValue[]) {
  return createMemo(() => {
    let classes: Record<string, boolean | undefined> = {};

    for (const className of classNames) {
      if (typeof className === "string") {
        classes[className] = true;
      } else if (Array.isArray(className)) {
        for (const c of className) {
          classes[c] = true;
        }
      } else if (className !== null && typeof className === "object") {
        classes = {
          ...classes,
          ...className,
        };
      }
    }

    return classes;
  });
}

export function createClassName(...classNames: ClassNameValue[]) {
  return createMemo(() => {
    const classes: string[] = [];

    for (const className of classNames) {
      if (typeof className === "string") {
        classes.push(className);
      } else if (Array.isArray(className)) {
        classes.push(...className);
      } else if (className !== null && typeof className === "object") {
        for (const key in className) {
          const enabled = className[key];
          if (enabled) classes.push(key);
        }
      }
    }

    return classes.join(" ");
  });
}
