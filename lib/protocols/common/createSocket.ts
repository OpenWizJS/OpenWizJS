import udp from "dgram";

function createSocket(): udp.Socket {
  return udp.createSocket("udp4");
}

export default createSocket;
