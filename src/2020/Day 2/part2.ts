import { passwordsDatabase } from "./passwords";
import { Password } from "./password";



class PasswordChecker {
    /**
     * Devuelve el numero de passwords validas segun su policy
     */
  public validPasswords = (passwords: Password[]): number => passwords.filter(p => p.isValidSecondPolicy).length;
}

console.time("Part2")
const passwords = passwordsDatabase.map(definition => new Password(definition));
console.log("Answer:", new PasswordChecker().validPasswords(passwords));
console.timeEnd("Part2")
