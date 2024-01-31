import { fakeData } from "./fakeData";

export function fakeApiResponse(key) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const jsonData = fakeData?.[key] ?? fakeData["wrong_endpoint"];
      resolve(jsonData);
    }, 600);
  });
}
