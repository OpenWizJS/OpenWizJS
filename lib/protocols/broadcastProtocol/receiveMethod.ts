import bytesToObject from "../common/bytesToObject";

function receiveMethod(data: Buffer): WizMethodResponse<DiscoveryResult> {
  return bytesToObject<WizMethodResponse<DiscoveryResult>>(data);
}

export default receiveMethod;
