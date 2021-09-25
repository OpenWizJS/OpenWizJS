import createRgbProperties from "./createRgbProperties";
import WizLightProperties from "../classes/WizLightProperties";

/**
 * Turns a specified hexadecimal value either as a string or as a number
 * into {@link WizLightProperties} with red, green and blue set.
 * Calls {@link createRgbProperties} under the hood.
 *
 * @param hex Either a hexadecimal string ("######", where each # is a single digit)
 * or a hexadecimal number.
 */
function createRgbPropertiesFromHex(hex: string | number): WizLightProperties {
  function create(value: number): WizLightProperties {
    const red = (value & 0xff0000) >> 16;
    const green = (value & 0x00ff00) >> 8;
    const blue = value & 0x0000ff;

    return createRgbProperties(red, green, blue);
  }

  if (typeof hex === "string") {
    const reg = /^#[0-9a-fA-F]{1,6}$/;
    if (reg.test(hex)) {
      const supposedNumber = parseInt(hex.slice(1), 16);
      return create(supposedNumber);
    }

    const number = parseInt(hex, 16);

    if (isNaN(number))
      throw new Error(
        "Invalid hex string specified. Format: '#000000' or '000000'."
      );

    return create(number);
  }

  return create(hex);
}

export default createRgbPropertiesFromHex;
