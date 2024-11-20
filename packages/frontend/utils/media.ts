export function IsNotMp4(id: string | undefined) {
  if (id?.toString().slice(-3) === "mp4") {
    return false;
  }
  return true;
}
