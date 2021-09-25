import udp from "dgram";
import objectToBytes from "../common/objectToBytes";

async function broadcastRegistration(
  socket: udp.Socket,
  host: ConnectionInformation
): Promise<Error | null> {
  const registerMessage = {
    method: "registration",
    params: {
      phoneMac: "AAAAAAAAAAAA",
      register: false,
      phoneIp: "1.2.3.4",
      id: "1",
    },
  };

  const registerMessageBytes = objectToBytes(registerMessage);

  return new Promise((resolve, reject) => {
    socket.send(registerMessageBytes, host.port, host.ip, (err) => {
      if (err) return reject(err);

      console.log("Sent discovery message.");

      resolve(null);
    });
  });
}

export default broadcastRegistration;
