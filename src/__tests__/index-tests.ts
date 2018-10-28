import { Vermeer, Dataset } from "../index";

const datasets: Dataset[] = [
  {
    type: "scatter",
    data: [{ x: 2, y: 3 }, { x: 3, y: 23 }]
  }
];

const canvasElement = {
  getContext: () => ({
    scale: jest.fn(),
    clearRect: jest.fn(),
    arc: jest.fn(),
    beginPath: jest.fn(),
    fill: jest.fn()
  }),
  height: 50,
  width: 50
};

describe("Vermeer", () => {
  it("should initialize without error", () => {
    new Vermeer({
      datasets,
      // @ts-ignore
      canvasElement
    });
  });

  it("should compute bounds", () => {
    const v = new Vermeer({
      datasets,
      // @ts-ignore
      canvasElement
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
      canvasElement
    });

    expect(v.scale({ x: 20, y: 14 })).toEqual([10, 50 - 7]);
  });
});
