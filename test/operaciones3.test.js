/* eslint-disable no-undef */
const operaciones = require("./operaciones.js");

// eslint-disable-next-line no-undef


test("pruebas multiplicacion", () => {
    expect(operaciones.multiplicacion(3, 6)).toBe(18);
    expect(operaciones.multiplicacion(5, 6)).toBe(30);
});

