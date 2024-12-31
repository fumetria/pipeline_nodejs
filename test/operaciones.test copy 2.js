/* eslint-disable no-undef */
import { esPar } from "./operaciones.js";

// eslint-disable-next-line no-undef

test("es par?", () => {
    expect(esPar(6)).toBe(true);
    expect(esPar(5)).toBe(false);
});