export function minimizeBytes(bytes) {
  let res = bytes;

  let i = 0;
  const sizeArr = ["B", "KB", "MB", "GB", "TB", "PB"];

  while (res / 1000 > 1) {
    res /= 1000.0;
    i++;
  }

  return res.toFixed(2) + sizeArr[i];
}
