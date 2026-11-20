export function chartAxisTitle(axis, text, color, family, mobile) {
  return {
    axis,
    type: axis === "x" ? "category" : "linear",
    position: axis === "x" ? "top" : "right",
    display: mobile,
    title: { display: true, text, color, font: { family } },
    ticks: { display: false },
    grid: { display: false },
    border: { display: false },
  };
}
