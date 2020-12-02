import { passwordsDatabase } from "./passwords";
import { Password } from "./password";

console.time("Part1");
const passwords = passwordsDatabase.map(definition => new Password(definition));
console.log("Answer:", passwords.filter(p => p.isValidFirstPolicy).length);
console.timeEnd("Part1");
