function objectToBytes(obj: Record<string, unknown>): Buffer {
  const objAsString = JSON.stringify(obj);
  return Buffer.from(objAsString);
}

export default objectToBytes;
