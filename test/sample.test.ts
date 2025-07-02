import { expect, test, describe } from "vitest";
import { prisma } from "~/utils/database.server";

describe("Database Operations", () => {
  test("DATABASE TEST", async () => {
    await prisma.user.create({
      data: {
        email: "john.doe@example.com",
        password: "password",
        location: "Somewhere",
      },
    });
  });
});

describe("Basic Math Operations", () => {
  test("adds 1 + 2 to equal 3", () => {
    expect(1 + 2).toBe(3);
  });

  test("multiplies 4 * 5 to equal 20", () => {
    expect(4 * 5).toBe(20);
  });

  test("divides 15 by 3 to equal 5", () => {
    expect(15 / 3).toBe(5);
  });

  test("subtracts 10 - 7 to equal 3", () => {
    expect(10 - 7).toBe(3);
  });
});

describe("Array Operations", () => {
  test("finds array length", () => {
    const numbers = [1, 2, 3, 4, 5];
    expect(numbers.length).toBe(5);
  });

  test("adds element to array", () => {
    const fruits = ["apple", "banana"];
    fruits.push("orange");
    expect(fruits).toContain("orange");
    expect(fruits.length).toBe(3);
  });

  test("filters array elements", () => {
    const numbers = [1, 2, 3, 4, 5, 6];
    const evenNumbers = numbers.filter((num) => num % 2 === 0);
    expect(evenNumbers).toEqual([2, 4, 6]);
  });
});

describe("Object Operations", () => {
  test("checks object property", () => {
    const person = { name: "Alice", age: 30 };
    expect(person.name).toBe("Alice");
    expect(person.age).toBe(30);
  });

  test("merges objects", () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { c: 3, d: 4 };
    const merged = { ...obj1, ...obj2 };
    expect(merged).toEqual({ a: 1, b: 2, c: 3, d: 4 });
  });
});

describe("Boolean Logic", () => {
  test("checks truthy values", () => {
    expect(true).toBe(true);
    expect(1).toBeTruthy();
    expect(0).toBeFalsy();
  });

  test("checks null and undefined", () => {
    expect(null).toBeNull();
    expect(undefined).toBeUndefined();
  });
});
