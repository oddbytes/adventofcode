import * as data from "./input.json";

const getSum = (data: unknown): number => {
  const values = Object.values(data);

  //Si algun valor contiene "red" o sie le valor pasado es un string, devolver 0
  if (
    (!Array.isArray(data) && values.some((p) => p == "red")) ||
    typeof data == "string"
  )
    return 0;
  const keys = Object.keys(data);

  //Si es un tipo primitivo devolverlo
  if (typeof data == "number") return data;

  // Si no recorrer todas sus propiedades
  return keys.reduce((sum, key) => (sum += getSum(data[key])), 0);
};

console.log("Answer:", getSum(data));
