/* eslint-disable no-undef */
import { multiplicacion } from "./operaciones.js";

// eslint-disable-next-line no-undef


test("pruebas multiplicacion", () => {
    expect(multiplicacion(3, 6)).toBe(18);
    expect(multiplicacion(5, 6)).toBe(12);
});

