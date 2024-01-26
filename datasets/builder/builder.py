import io
import json
import requests
import pandas as pd


def get_dataset(url: str) -> pd.DataFrame:
  headers = {
    "Accept-Language": "en-US,en;q=0.9",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
  }
  response = requests.get(url, headers=headers)
  data = pd.read_csv(io.BytesIO(response.content), sep="\s+", index_col=0)

  return data


url = "https://download.bls.gov/pub/time.series/cu/cu.data.1.AllItems"
data = get_dataset(url)

for dataset_name in ["CUUR0000SA0"]:
  dataset = data.loc[dataset_name, ["year", "period", "value"]]

  dataset["period"] = dataset["period"].astype(str).str.removeprefix("M").astype(int)
  dataset["period"] = dataset["period"].replace(13, 0)  # M13 is the annual average

  dataset.set_index("year", drop=True).groupby(level=0).apply(lambda x: json.loads(x.set_index("period").squeeze().to_json(orient="index"))).to_json(f"{dataset_name}.json", orient="index")
