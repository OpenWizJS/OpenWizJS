import WizLightProperties from "../classes/WizLightProperties";

/**
 * Creates a {@link WizLightProperties} class instance with red, green and blue set to
 * the specified values.
 *
 * @param red The red value. Will default to current red value on device if undefined.
 * @param green The green value. Will default to current green value on device if undefined.
 * @param blue The blue value. Will default to current blue value on device if undefined.
 */
function createRgbProperties(
  red?: number,
  green?: number,
  blue?: number
): WizLightProperties {
  return new WizLightProperties({
    red,
    green,
    blue,
  });
}

export default createRgbProperties;
