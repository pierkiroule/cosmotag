const poeticWords = [
  'lueur', 'souffle', 'racine', 'comète', 'abandon',
  'silence', 'écho', 'rivage', 'brume', 'secret',
  'cristal', 'ombre', 'murmure', 'poussière', 'horizon',
  'rêve', 'plume', 'perle', 'cendre', 'infini'
];

/**
 * Génère une liste de 5 à 7 feuilles poétiques uniques.
 * Chaque feuille est un objet avec un id et un mot.
 * @returns {Array<{id: number, word: string}>}
 */
export const generateTodaysLeaves = () => {
  const shuffled = [...poeticWords].sort(() => 0.5 - Math.random());
  const count = Math.floor(Math.random() * 3) + 5; // Entre 5 et 7
  const selectedWords = shuffled.slice(0, count);

  return selectedWords.map((word, index) => ({
    id: index,
    word: word,
  }));
};