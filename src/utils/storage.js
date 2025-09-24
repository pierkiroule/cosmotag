/**
 * Sauvegarde une valeur dans le localStorage après l'avoir convertie en JSON.
 * @param {string} key - La clé sous laquelle sauvegarder la valeur.
 * @param {any} value - La valeur à sauvegarder.
 */
export const saveToStorage = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde sur le localStorage:", error);
  }
};

/**
 * Charge une valeur depuis le localStorage et la désérialise.
 * @param {string} key - La clé de la valeur à charger.
 * @returns {any | null} La valeur désérialisée ou null si la clé n'existe pas ou en cas d'erreur.
 */
export const loadFromStorage = (key) => {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) {
      return null;
    }
    return JSON.parse(serializedValue);
  } catch (error) {
    console.error("Erreur lors du chargement depuis le localStorage:", error);
    return null;
  }
};