import { PasswordGenerator } from "./passwordGenerator";

const passwordGenerator = new PasswordGenerator();
const passwords = passwordGenerator.generate();
const validPasswords = passwordGenerator.filter(passwords);
console.log(validPasswords);
console.log("Total:", validPasswords.length);
