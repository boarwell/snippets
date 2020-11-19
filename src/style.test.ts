export {};

test("rem()", async () => {
  const cases = [
    { input: 0, expected: "0rem" },
    { input: 14, expected: "0.875rem" },
    { input: 16, expected: "1rem" },
    { input: 32, expected: "2rem" },
  ];

  const { rem } = await import("./style");
  cases.forEach(({ input, expected }) => {
    expect(rem(input)).toBe(expected);
  });
});

test("em()", async () => {
  const cases = [
    { base: 12, input: 0, expected: "0em" },
    { base: 16, input: 32, expected: "2em" },
    { base: 28, input: 28, expected: "1em" },
  ];

  const { em } = await import("./style");
  cases.forEach(({ base, input, expected }) => {
    expect(em(base)(input)).toBe(expected);
  });
});
