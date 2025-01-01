/* eslint-disable no-undef */
const operacion = require("./operaciones.js");

// eslint-disable-next-line no-undef
test("pruebas de sumas", () => {
    expect(operacion.sum(3, 6)).toBe(9);
    expect(operacion.sum(5, 6)).toBe(11);
});
