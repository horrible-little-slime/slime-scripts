import { myMp, print } from "kolmafia";

export function checkMP() {
  if (myMp() < 200) {
    return "Your MP is less than 200.";
  } else {
    return "Your MP is greater than or equal to 200.";
  }
}

export function main() {
  print(checkMP());
}
