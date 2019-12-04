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
      // 1 - Two adjacent digits are the same
      for (let position = 0; position < 5; position++) {
        if (
          this.getDigit(currentPassword, position) ==
          this.getDigit(currentPassword, position + 1)
        ) {
          valid = true;
          break;
        }
      }

      // 2 -Going from left to right, the digits never decrease; they only ever increase or stay the same (like 111123 or 135679)
      if (valid == true) {
        for (let position = 0; position < 5; position++) {
          if (
            this.getDigit(currentPassword, position + 1) <
            this.getDigit(currentPassword, position)
          ) {
            valid = false;
          }
        }
        if (valid == true) {
          validPasswords.push(currentPassword);
        }
      }

      currentPassword++;
    }
    return validPasswords;
  }

  private getDigit(cipher: number, position: number): number {
    return parseInt(cipher.toString()[position]);
  }

  /**
   * Filter a set of password using part 2 criteria
   * @param passwords
   */

  public filter(passwords: number[]): number[] {
    const validPasswords: number[] = [];
    passwords.forEach(password => {
      let valid = false;
      const digits = [0, 1, 2, 3, 4, 5].map(pos =>
        this.getDigit(password, pos)
      );
      // Some digit repeats ONLY  TWICE
      digits.forEach(d => {
        valid = valid || digits.filter(d1 => d1 == d).length == 2;
      });
      if (valid) {
        validPasswords.push(password);
      }
    });
    return validPasswords;
  }
}
