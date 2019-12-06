import { PasswordGenerator } from "./passwordGenerator";

const passwordGenerator = new PasswordGenerator();
const passwords = passwordGenerator.generate();
console.log(passwords);
console.log("Total:", passwords.length);
