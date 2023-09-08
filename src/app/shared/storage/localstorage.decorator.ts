/* eslint-disable @typescript-eslint/no-explicit-any */
import { instanceToPlain, plainToInstance } from "class-transformer";

export function LocalStorage(key?: string) {
  return (target: any, propertyKey: string) => {
    const storageKey = `${target.constructor.name}_${key || propertyKey}`;

    // Getter
    const getter = (): any => {
      const storedData = localStorage.getItem(storageKey);
      return storedData ? plainToInstance(target.constructor, JSON.parse(storedData)) : undefined;
    };

    // Setter
    const setter = (newData: any): void => {
      localStorage.setItem(storageKey, JSON.stringify(instanceToPlain(newData)));
    };

    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  };
}