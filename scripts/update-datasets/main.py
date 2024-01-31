import asyncio
import io
import json
import subprocess
# from datetime import datetime
from pathlib import Path

import httpx
import pandas as pd
# import semver


PACKAGES_DIR = Path(__file__).parent.parent.parent / "datasets"

DATASETS = {
  "CUUR0000SA0": {
    "description": "All items in U.S. city average, all urban consumers, not seasonally adjusted",
    "package": "cpi-u",
    "url": "https://download.bls.gov/pub/time.series/cu/cu.data.1.AllItems",
    "columns": ["year", "period", "value"],
  },
  "CWUR0000SA0": {
    "description": "All items in U.S. city average, wage earners, not seasonally adjusted",
    "package": "cpi-w",
    "url": "https://download.bls.gov/pub/time.series/cw/cw.data.1.AllItems",
    "columns": ["year", "period", "value"],
  },
}

HEADERS = {
  "Accept-Language": "en-US,en;q=0.9",
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
}


async def get_dataset(client: httpx.AsyncClient, url: str) -> pd.DataFrame:
  """Download and parse a time series from the BLS website."""

  response = await client.get(url, headers=HEADERS)
  data = pd.read_csv(io.BytesIO(response.content), sep="\s+", index_col=0)

  return data


def format_annual_data(x: pd.DataFrame) -> dict:
  """Convert data for a single year into a period-indexed dictionary."""

  data = x.set_index("period").squeeze().to_json(orient="index")

  return json.loads(data)


async def update_package_data(
    client: httpx.AsyncClient,
    dataset_name: str,
    dataset_details: dict[str, str],
) -> None:
  """Download, process, and write a dataset to a package."""

  data = await get_dataset(client, dataset_details["url"])
  dataset = data.loc[dataset_name, dataset_details["columns"]]

  dataset["period"] = dataset["period"].str.removeprefix("M").astype(int)
  dataset["period"] = dataset["period"].replace(13, 0)  # M13 is the annual average

  dataset = dataset.set_index("year", drop=True)
  dataset = dataset.groupby(level=0).apply(format_annual_data)

  output_path = PACKAGES_DIR / dataset_details["package"] / "data" / "data.json"
  dataset.to_json(output_path, orient="index")


def update_package_metadata(dataset_package: str) -> None:
  """Update the package metadata."""

  package_dir = PACKAGES_DIR / dataset_package
  package_json = package_dir / "package.json"

  with open(package_json, "r") as f:
    package = json.load(f)

  # TODO: semantic-release doesn't support build metadata
  # version = semver.VersionInfo.parse(package["version"])
  # today = datetime.today().strftime("%Y%m%d")
  # package["version"] = str(version.replace(build=today))

  with open(package_json, "w") as f:
    json_dump = json.dumps(package, indent=2)
    f.write(f"{json_dump}\n")


async def update_package(
    client: httpx.AsyncClient,
    dataset_name: str,
    dataset_details: dict[str, str],
) -> None:
  """Update a package."""

  dataset_package = dataset_details["package"]
  try:
    await update_package_data(client, dataset_name, dataset_details)
    update_package_metadata(dataset_package)

    subprocess.run(["git", "add", str(PACKAGES_DIR / dataset_package)], shell=True, check=True)
    # "feat" is how semantic-release knows to create a release
    subprocess.run(["git", "commit", "-m", f"feat: update {dataset_package}"], shell=True, check=True)
  except Exception as e:
    print(f"Failed to update {dataset_name}: {e}")


async def main():
  async with httpx.AsyncClient() as client:
    await asyncio.gather(
      *[update_package(client, name, details) for name, details in DATASETS.items()],
    )


if __name__ == "__main__":
  asyncio.run(main())
