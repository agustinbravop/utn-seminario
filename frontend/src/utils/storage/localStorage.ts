/*
 * To get the value from local storage that matches the given key
 * @param {string} key
 * @returns The value of the key argument
 */
export function readLocalStorage(key: string) {
  try {
    return JSON.parse(localStorage.getItem(key) || "");
  } catch {
    return localStorage.getItem(key);
  }
}

/**
 * To set the key-value pair to local storage
 * @param {string} key
 * @param {any} value
 * @returns N/A
 */
export function writeLocalStorage(key: string, value: any) {
  if (typeof value === "object") {
    localStorage.setItem(key, JSON.stringify(value));
  } else {
    localStorage.setItem(key, value);
  }
}
