import requests


NOAA_URL = (
    "https://api.water.noaa.gov/nwps/v1/gauges"
    "?bbox.xmin=-79.9"
    "&bbox.ymin=40.4"
    "&bbox.xmax=-71.8"
    "&bbox.ymax=45.2"
    "&srid=EPSG_4326"
)



def download_gauges():

    print("Downloading NOAA gauges...")

    response = requests.get(
        NOAA_URL,
        timeout=30
    )

    response.raise_for_status()

    data = response.json()

    print(
        f"Downloaded {len(data['gauges'])} gauges"
    )

    return data