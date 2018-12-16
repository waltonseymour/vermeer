import { Vermeer, Dataset } from "../index";

const datasets: Dataset[] = [
  {
    type: "scatter",
    data: [{ x: 2, y: 3 }, { x: 3, y: 23 }]
  }
];

const targetElement = {
  appendChild: jest.fn(),
  clientHeight: 50,
  clientWidth: 50
};

describe("Vermeer", () => {
  it("should initialize without error", () => {
    new Vermeer({
      datasets,
      // @ts-ignore
      targetElement
    });
  });

  it("should compute bounds", () => {
    const v = new Vermeer({
      datasets,
      // @ts-ignore
      targetElement
    });

    expect(v.bounds("x")).toEqual([2, 3]);
    expect(v.bounds("y")).toEqual([3, 23]);
  });

  it("should scale correctly", () => {
    const datasets: Dataset[] = [
      {
        type: "scatter",
        data: [{ x: 0, y: 0 }, { x: 100, y: 100 }, { x: 20, y: 14 }]
      }
    ];

    const v = new Vermeer({
      datasets,
      // @ts-ignore
      targetElement
    });

    expect(v.scale({ x: 20, y: 14 })).toEqual([10, 50 - 7]);
  });
});
