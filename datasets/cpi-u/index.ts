import data from "./data.json";

export default (cuppy: { datasets: Record<string, any> }) => {
  cuppy.datasets["cpiU"] = {
    data,
    years: Object.keys(data)
      .map(Number)
      .sort((a, b) => a - b),
  };
};
