import { Md5 } from "ts-md5"; //make sure it points to the folder where the md5.ts file is

const start = "iwrupvqb";
let i = 0;
let hash = "";
while (!hash.startsWith("000000")) {
  hash = Md5.hashStr(start + (i++).toString());
}
console.log(i - 1, hash);
