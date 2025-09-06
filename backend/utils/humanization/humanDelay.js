export function humanDelay(min = 1000, max = 3000) {
  const time = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((res) => setTimeout(res, time));
}
