export class Updates {
  /**
   * Checks if an update is correct given the precedences ap
   * @param update - The update to check
   * @param precedences - The precedences map
   * @returns - True if the update is correct, false otherwise
   */
  public isCorrect = (
    update: number[],
    precedences: Map<number, number[]>
  ): boolean =>
    update.every((u1, index) => {
      //Check list of precedences of the numbers that follow the current one
      //If this one is not in the list of precedences of any of them, it's  correct
      for (let j = index + 1; j < update.length; j++) {
        const u2 = update[j];
        if (precedences.has(u2)) {
          if (precedences.get(u2).includes(u1)) return false; //exists in the list of precedences, u2 should be BEFORE u1
        } else return true; //No rules for u2
      }
      //Every check passed
      return true;
    });
}
