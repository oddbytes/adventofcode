import { report } from "process";

export class Reports {
  public getSafeReports = (reports: number[][]) =>
    //A report is safe if the absolute difference between its levels is >0 and <4

    reports.filter((report) => {
      // Increasing or decreasing series?
      const increasing = report[1] - report[0] > 0; //Not increasing or decreasing ones are marked as decreasing (ie [ 20 20 12....])
      for (let i = 0; i < report.length - 1; i++) {
        const diff = report[i + 1] - report[i];
        if ((increasing && diff < 1) || (!increasing && diff > -1))
          return false;
        if (Math.abs(diff) < 1 || Math.abs(diff) > 3) return false;
      }
      return true;
    });
}
