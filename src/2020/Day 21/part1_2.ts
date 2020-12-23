import { FoodAnalyzer } from "./foodAnalyzer";

console.time("part1_2");
const foodAnalyzer = new FoodAnalyzer("./foods.txt");
// Buscar y eliminar ingredientes con alergenos de la comida
foodAnalyzer.removeAllergens();
// Obtener todos los ingredientes, incluso repetidos, que no son alergenos
const freeAllergenIngredients = foodAnalyzer.foods.flatMap(
  (f) => f.ingredients
);
console.log("Answer 1:", freeAllergenIngredients.length);

//part2
//ordenar los ingredientes por orden alfabético de alérgeno
const sortedAllergenDictionary = Array.from(
  foodAnalyzer.allergensMap.entries()
).sort();
const canonicalList = sortedAllergenDictionary
  .map((entry) => entry[1])
  .join(",");
console.log("Answer 2:", canonicalList);
console.timeEnd("part1_2");
