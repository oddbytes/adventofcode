export class PasswordGenerator {
  private minRange = 387638;
  private maxRange = 919123;
  /**
   * return all the passwords witih the range than fullfill the conditions
   */
  public generate(): number[] {
    let currentPassword = this.minRange;
    const validPasswords: number[] = [];
    while (currentPassword < this.maxRange + 1) {
      let valid = false;
      const digits = Array.from(currentPassword.toString());
      // 1 - Two adjacent digits are the same
      valid = digits.some((digit, index) => digit == digits[index + 1]);

      /* Equivalent for (let position = 0; position < 5; position++) {
        if (digits[position] == digits[position + 1]) {
          valid = true;
          break;
        }
      }*/

      // 2 -Going from left to right, the digits never decrease; they only ever increase or stay the same (like 111123 or 135679)
      if (valid) {
        valid =
          valid && !digits.some((digit, index) => digits[index + 1] < digit);
      }

      /*EQUIVALENT 
      for (let position = 0; position < 5; position++) {
        if (digits[position + 1] < digits[position]) {
          valid = false;
        }
      }*/

      if (valid) {
        validPasswords.push(currentPassword);
      }

      currentPassword++;
    }
    return validPasswords;
  }

  /**
   * Filter a set of password using part 2 criteria
   * @param passwords
   */

  public filter(passwords: number[]): number[] {
    const validPasswords: number[] = [];
    passwords.forEach(password => {
      const digits = Array.from(password.toString());
      // valid if any digit repeats ONLY  TWICE
      if (digits.some(d => digits.filter(d1 => d1 == d).length == 2)) {
        validPasswords.push(password);
      }
    });
    return validPasswords;
  }
}
