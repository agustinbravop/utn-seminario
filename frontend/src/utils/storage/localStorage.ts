/**
 * Obtiene un string JSON de localStorage y lo devuelve parseado como un objeto.
 * @param {string} key la llave del objecto a guardar
 * @returns el valor de la llave pasada por parámetro, como objeto
 */
export function readLocalStorage<T>(key: string): T | null {
  try {
    return JSON.parse(localStorage.getItem(key) || "");
  } catch {
    return null;
  }
}

/**
 * Guarda un objeto en localStorage como JSON.
 * @param {string} key
 * @param {object} value objeto a guardar. Si es null, se limpia el valor guardado.
 */
export function writeLocalStorage(key: string, value: object | null) {
  // Retrieve old value before we store the new one
  const oldValue = localStorage.getItem(key);
  let newValue;
  if (value === null) {
    newValue = null;
    localStorage.removeItem(key);
  } else {
    newValue = JSON.stringify(value);
    localStorage.setItem(key, newValue);
  }

  // Manually fire a "storage" event so this window is alerted. On its own,
  // localStorage.setItem() only fires a "storage" event for other tabs.
  const e = new StorageEvent("storage", {
    storageArea: window.localStorage,
    key,
    oldValue,
    newValue,
    url: window.location.href,
  });
  window.dispatchEvent(e);
}
