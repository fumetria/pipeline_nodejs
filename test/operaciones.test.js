/* eslint-disable no-undef */
import { sum, multiplicacion, esPar } from './operaciones.js';

// eslint-disable-next-line no-undef
test("pruebas de sumas", () => {
    expect(sum(3, 6)).toBe(10);
    expect(sum(5, 6)).toBe(12);
});

test("pruebas multiplicacion", () => {
    expect(multiplicacion(3, 6)).toBe(18);
    expect(multiplicacion(5, 6)).toBe(12);
});

test("es par?", () => {
    expect(esPar(6)).toBe(18);
    expect(esPar(5)).toBe(12);
});