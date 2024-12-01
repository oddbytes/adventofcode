export class Reactor {
  /**
   * Fires reactions in the polymer, destroying opposite particles
   * @param polymer
   * @returns resulting  polymer
   */
  public fireReactions = (polymer: string): string => {
    let i = 0;
    while (i < polymer.length - 2) {
      if (Math.abs(polymer.charCodeAt(i) - polymer.charCodeAt(i + 1)) == 32) {
        //If one letter and the next are only different because of capitalization
        polymer = polymer.substring(0, i) + polymer.substring(i + 2); //remove them from the string
        i = Math.max(0, i - 1);
      } else {
        i++;
      }
    }
    return polymer;
  };

  public destroyParticles = (polymer: string, particle: string): string => {
    return polymer.replace(new RegExp(particle, "ig"), "");
  };
}
