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
  if (value === null) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
