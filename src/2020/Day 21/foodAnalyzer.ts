import * as fs from "fs";
import { Queue } from "../../common/queue";

/**
 * representa una comida, con su lista de ingredientes y de posibles alergenos
 */
type Food = {
  ingredients: string[];
  allergens: string[];
};

export class FoodAnalyzer {
  public foods: Food[] = [];
  // diccionario de alergenos - ingredientes resueltos
  public allergensMap: Map<string, string> = new Map<string, string>();

  constructor(foodsFile: string) {
    this.foods = fs
      .readFileSync(foodsFile, "utf8")
      .split("\r\n")
      .map((food) => {
        const parts = food.split(" (contains ");
        //sqjhc mxmxvkd sbzzf (contains fish)

        return {
          ingredients: parts[0].split(" "),
          allergens: parts[1].replace(")", "").split(", "),
        };
      });
  }

  /**
   * Devuelve los alergenos diferentes que existen en todas las comidas
   */
  private get uniqueAllergens() {
    return new Queue([...new Set(this.foods.flatMap((f) => f.allergens))]);
  }

  /**
   * Devuelve la interseccion de n conjuntos de datos
   * @param foods arrays de datos que representan los diferentes conjuntos
   */
  private intersect = (foods: Food[]) => {
    let commonIngredients = foods[0].ingredients;
    for (let index = 1; index < foods.length; index++)
      commonIngredients = commonIngredients.filter((x) =>
        foods[index].ingredients.includes(x)
      );
    return commonIngredients;
  };

  public removeAllergens = (): void => {
    const allergens = this.uniqueAllergens;
    while (allergens.length > 0) {
      //Probamos a buscar el ingrediente de este alergeno
      const allergen = allergens.pop();
      const foodsWidthAllergen = this.foods.filter((f) =>
        f.allergens.includes(allergen)
      );

      const commonIngredients = this.intersect(foodsWidthAllergen);
      //  console.log(allergen, commonIngredients);
      if (commonIngredients.length == 1) {
        //hemos dato con el ingrediente que contiene el alergeno
        //Eliminar el ingrediente de todas las comidas
        this.foods.forEach((f) => {
          commonIngredients.forEach((ing) => {
            const index = f.ingredients.indexOf(ing);
            if (index > -1) f.ingredients.splice(index, 1);
          });
        });

        this.allergensMap.set(allergen, commonIngredients[0]);
      } else allergens.push(allergen); //No lo hemos encontrado. Lo dejamos para mas tarde
    }
  };
}
