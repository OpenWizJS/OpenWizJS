function bytesToObject<T>(bytes: Buffer): T {
  const dataString = bytes.toString("utf-8");
  return JSON.parse(dataString) as T;
}

export default bytesToObject;
