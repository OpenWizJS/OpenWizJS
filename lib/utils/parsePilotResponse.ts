import WizLightProperties from "../classes/WizLightProperties";

function parsePilotResponse(pilotResponse: PilotResponse): {
  properties: WizLightProperties;
  state: boolean;
} {
  const {
    r: red,
    g: green,
    b: blue,
    c: coldWhite,
    w: warmWhite,
    dimming: brightness,
    state,
  } = pilotResponse;

  const wizLightProperties = new WizLightProperties({
    warmWhite,
    coldWhite,
    red,
    green,
    blue,
    brightness,
  });

  return {
    properties: wizLightProperties,
    state: state,
  };
}

export default parsePilotResponse;
