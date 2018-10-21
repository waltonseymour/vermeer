import { Vermeer } from "../index";

describe("Vermeer", () => {
  it("should initialize without error", () => {
    const datasets = [[{ x: 2, y: 3 }, { x: 3, y: 23 }]];
    new Vermeer({
      datasets,
      // @ts-ignore
      canvasElement: {
        getContext: jest.fn(),
        height: 20,
        width: 20
      }
    });
  });
});
