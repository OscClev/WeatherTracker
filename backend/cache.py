import json
import os
from datetime import datetime


CACHE_FILE = "data/gauges.json"



def save_cache(data):

    os.makedirs(
        "data",
        exist_ok=True
    )


    output = {

        "updated":
            datetime.utcnow().isoformat(),

        "gauges":
            data["gauges"]

    }


    with open(
        CACHE_FILE,
        "w"
    ) as file:

        json.dump(
            output,
            file,
            indent=2
        )



def load_cache():

    if not os.path.exists(CACHE_FILE):

        return None


    with open(
        CACHE_FILE,
        "r"
    ) as file:

        return json.load(file)