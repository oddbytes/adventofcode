import { reactions } from "./reactions";
import { Element, IElement, ElementProduction } from "./element";

//Import reactions
const elementsProduction = reactions.map(reaction => {
  // 7 PZDPS, 18 HGDHV, 9 TBKM => 4 JHVL
  const myRegexp: RegExp = /((\d+)\s(.+?))(,|\=\>|$)/g;
  const parts: IElement[] = [];
  let match = myRegexp.exec(reaction);
  while (match != null) {
    parts.push(new Element(match[3].trim(), parseInt(match[2])));

    match = myRegexp.exec(reaction);
  }
  return new ElementProduction(
    new Element(
      parts[parts.length - 1].name,
      parts[parts.length - 1].units,
      parts.slice(0, parts.length - 1)
    ),
    0
  );
});

const getBasicElements = (element: IElement, units: number): IElement[] => {
  //replace a element childs by its simplest
  if (element.producedBy[0].name == "ORE") {
    return [new Element(element.name, units)];
  }
  return element.producedBy
    .map(child => {
      const eroot = elementsProduction.find(ep => ep.element.name == child.name)
        .element;
      const packages = Math.ceil(units / element.units);

      return getBasicElements(eroot, packages * child.units);
    })
    .flat();
};

const fuel = elementsProduction.find(e => e.element.name === "FUEL");
const basicElements = getBasicElements(fuel.element, 1);

const names = basicElements
  .map(e => e.name)
  .filter((n, i, a) => a.indexOf(n) == i)
  .sort();
//a
const totalOre = names.reduce((a, name) => {
  const element = elementsProduction.find(e => e.element.name == name).element;
  const neededUnits = basicElements
    .filter(e => e.name == name)
    .reduce((ac, el) => ac + el.units, 0);

  const packages = Math.ceil(neededUnits / element.units);
  const unitProduced = packages * element.units;
  console.log(
    `${neededUnits} of ${name} in ${packages} pck of ${
      element.units
    }  (${unitProduced} in all packages), ${(unitProduced / element.units) *
      element.producedBy[0].units} ORE`
  );

  return a + (unitProduced / element.units) * element.producedBy[0].units;
}, 0);

console.log(totalOre);
