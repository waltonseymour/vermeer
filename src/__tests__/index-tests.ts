import { Plot, Dataset } from "../index";

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
    new Plot({
      datasets,
      // @ts-ignore
      targetElement
    });
  });

  it("should cleanup canvas on destroy", () => {
    const v = new Plot({
      datasets,
      // @ts-ignore
      targetElement
    });

    v.canvasElement.remove = jest.fn();
    v.destroy();

    expect(v.canvasElement.remove.mock.calls.length).toEqual(1);
  });
});
