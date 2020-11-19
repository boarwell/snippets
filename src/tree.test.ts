import { Tree } from "./tree";

type A = {
  id: string;
  name: number;
};

type ATree = Tree<A>;

const atree: ATree = {
  id: "hoge",
  name: 1,
  children: [
    {
      id: "fuga",
      name: 2,
      children: [
        {
          id: "guru",
          name: 4,
          children: [
            {
              id: "musha",
              name: 6,
            },
          ],
        },

        {
          id: "mogu",
          name: 5,
        },
      ],
    },

    {
      id: "piyo",
      name: 3,
    },
  ],
};

test("hasStringValueOf", async () => {
  const { hasMatchingText } = await import("./tree");

  const completeMatch = hasMatchingText(atree, "id", "hoge");
  const partialMatch = hasMatchingText(atree, "id", "og");
  const noMatch = hasMatchingText(atree, "id", "invalid");

  // 以下の2つのコメントアウトを外したらエラーになる
  // const invalidPropName = hasStringValueOf(atree, 'no-exist', 'invalid');
  // const valueIsNotString = hasStringValueOf(atree, 'name', 'invalid');

  expect(completeMatch).toBe(true);
  expect(partialMatch).toBe(true);
  expect(noMatch).toBe(false);
});

test("getValuesOfKey", async () => {
  const { getValuesOfKey } = await import("./tree");
  const id = getValuesOfKey(atree, "id").sort();
  expect(id).toMatchObject(
    ["hoge", "fuga", "piyo", "guru", "musha", "mogu"].sort()
  );
});
