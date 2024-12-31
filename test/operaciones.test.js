/* eslint-disable no-undef */
import { sum } from "./operaciones.js";

// eslint-disable-next-line no-undef
test("pruebas de sumas", () => {
    expect(sum(3, 6)).toBe(10);
    expect(sum(5, 6)).toBe(12);
});
