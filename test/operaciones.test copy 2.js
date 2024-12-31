/* eslint-disable no-undef */
const operaciones = require("./operaciones.js");

// eslint-disable-next-line no-undef

test("es par?", () => {
    expect(operaciones.esPar(6)).toBe(true);
    expect(esPar(5)).toBe(false);
});