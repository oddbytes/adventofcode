import * as fs from "fs";
import { Queue } from "../../common/queue";
//sqjhc mxmxvkd sbzzf (contains fish)

type Food = {
  ingredients: string[];
  allergens: string[];
};

const foods: Food[] = fs
  .readFileSync("./foods.txt", "utf8")
  .split("\r\n")
  .map((food) => {
    const parts = food.split(" (contains ");

    return {
      ingredients: parts[0].split(" "),
      allergens: parts[1].replace(")", "").replace(",", "").split(" "),
    };
  });

const allergens = new Queue([...new Set(foods.flatMap((f) => f.allergens))]);

const intersect = (foods: Food[]) => {
  let commonIngredients = foods[0].ingredients;
  for (let index = 1; index < foods.length; index++)
    commonIngredients = commonIngredients.filter((x) =>
      foods[index].ingredients.includes(x)
    );
  return commonIngredients;
};

const dict: Map<string, string> = new Map<string, string>();
while (allergens.length > 0) {
  const allergen = allergens.pop();
  const foodsWidthAllergen = foods.filter((f) =>
    f.allergens.includes(allergen)
  );
  //console.log(allergen, foodsWidthAllergen);

  const commonIngredients = intersect(foodsWidthAllergen);
  //  console.log(allergen, commonIngredients);
  if (commonIngredients.length == 1) {
    //Eliminar el ingrediente de todas las comidas
    foods.forEach((f) => {
      const index = f.ingredients.indexOf(commonIngredients[0]);
      if (index > -1) f.ingredients.splice(index, 1);
    });

    dict.set(allergen, commonIngredients[0]);
  } else allergens.push(allergen);
}
console.log("Answer", dict);
for (const entry in dict.entries()) console.log(entry);
