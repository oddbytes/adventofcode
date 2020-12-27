const cardPublicKey = 18499292;
const doorPublicKey = 8790390;

console.time("part1");

/**
 * Encuentra el numero origen y el tamaño de bucle para generar una clave publica
 * utilizando fuerza bruta
 * @param publicKey clave publica
 */
const findLoopSize = (publicKey: number) => {
  let subjectNumber = 1;
  let value = 1;
  let loopSize = 0;
  while (value != publicKey) {
    subjectNumber++;
    value = 1;
    loopSize = 0;
    //fuerza bruta. Maximo 10 millones de ciclos
    while (value != publicKey && loopSize < 10000000) {
      value = (value * subjectNumber) % 20201227;
      loopSize++;
    }
  }
  return loopSize;
};

/**
 * Genera una clave provada a partir de una publica y un tamaño de bucle
 * @param publicKey clave publica
 * @param loopSize tamaño de bucle
 */
const getSecretKey = (publicKey: number, loopSize: number): number => {
  let value = 1;
  while (loopSize-- > 0) value = (value * publicKey) % 20201227;

  return value;
};

const cardLoopSize = findLoopSize(cardPublicKey);
console.log("Answer:", getSecretKey(doorPublicKey, cardLoopSize));

console.timeEnd("part1");
