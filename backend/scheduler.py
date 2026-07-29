from apscheduler.schedulers.background import BackgroundScheduler

from noaa import download_gauges
from cache import save_cache



def update_gauges():

    try:

        data = download_gauges()

        save_cache(data)

        print(
            "Gauge cache updated"
        )


    except Exception as e:

        print(
            "Update failed:",
            e
        )



def start_scheduler():

    scheduler = BackgroundScheduler()


    scheduler.add_job(

        update_gauges,

        "interval",

        minutes=10

    )


    scheduler.start()


    update_gauges()