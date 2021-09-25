import createMethod from "../protocols/common/createMethod";

interface WizLightPropertiesParameters {
  warmWhite?: number;
  coldWhite?: number;
  speed?: number;
  sceneId?: number;
  red?: number;
  green?: number;
  blue?: number;
  brightness?: number;
  colorTemperature?: number;
}

class WizLightProperties {
  // Internal values
  private warmWhite?: number;
  private coldWhite?: number;
  private speed?: number;
  private sceneId?: number;
  private brightness?: number;
  private colorTemperature?: number;

  // Colors
  private red?: number;
  private green?: number;
  private blue?: number;

  constructor({
    warmWhite,
    coldWhite,
    speed,
    sceneId,
    red,
    green,
    blue,
    brightness,
    colorTemperature,
  }: WizLightPropertiesParameters) {
    if (warmWhite !== undefined) this.setWarmWhite(warmWhite);

    if (coldWhite !== undefined) this.setColdWhite(coldWhite);

    if (speed !== undefined) this.setSpeed(speed);

    if (sceneId !== undefined) this.setScene(sceneId);

    if (red !== undefined && green !== undefined && blue !== undefined)
      this.setRgb(red, green, blue);

    if (brightness !== undefined) this.setBrightness(brightness);

    if (colorTemperature !== undefined)
      this.setColorTemperature(colorTemperature);
  }

  getRawProperties(): WizLightPropertiesRaw {
    return {
      w: this.warmWhite,
      c: this.coldWhite,
      speed: this.speed,
      sceneId: this.sceneId,
      r: this.red,
      g: this.green,
      b: this.blue,
      dimming: this.brightness,
      temp: this.colorTemperature,
    };
  }

  getPilotMessageObject(): WizMethodRequest<WizLightPropertiesRaw> {
    return createMethod<WizLightPropertiesRaw>(
      "setPilot",
      this.getRawProperties()
    );
  }

  getPilotMessage() {
    const pilotMessage = this.getPilotMessageObject();

    return JSON.stringify(pilotMessage);
  }

  setWarmWhite(warmWhite: number) {
    if (warmWhite >= 0 && warmWhite <= 255) {
      this.warmWhite = warmWhite;
      return;
    }

    throw new Error("value must be between 0 and 255");
  }

  setColdWhite(coldWhite: number) {
    if (coldWhite >= 0 && coldWhite <= 255) {
      this.coldWhite = coldWhite;
      return;
    }

    throw new Error("value must be between 0 and 255");
  }

  setSpeed(speed: number) {
    if (speed > 0 && speed <= 100) {
      this.speed = speed;
      return;
    }

    throw new Error("value must be between 0 and 100");
  }

  setScene(sceneId: number) {
    if (sceneId > 0 && sceneId <= 32) {
      this.sceneId = sceneId;
      return;
    }

    throw new Error("value must be between 0 and 32");
  }

  setRgb(red: number, green: number, blue: number) {
    if (red < 0 || red > 255) throw new Error("red must be between 0 and 255");

    if (green < 0 || green > 255)
      throw new Error("green must be between 0 and 255");

    if (blue < 0 || blue > 255)
      throw new Error("blue must be between 0 and 255");

    this.red = red;
    this.green = green;
    this.blue = blue;
  }

  // TODO: check if it's not actually a percentage
  setBrightness(brightness: number) {
    const percentage = Math.round(brightness);

    if (percentage < 10) {
      this.brightness = 10;
      return;
    }

    if (percentage > 100) {
      throw new Error("brightness must be between 0 and 100");
    }

    this.brightness = percentage;
  }

  setColorTemperature(colorTemperature: number) {
    this.colorTemperature = colorTemperature;
  }
}

export default WizLightProperties;
