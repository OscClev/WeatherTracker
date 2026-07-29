from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from cache import load_cache
from scheduler import start_scheduler



app = FastAPI(
    title="FloodWatch NY API"
)



app.add_middleware(

    CORSMiddleware,

    allow_origins=[
        "*"
    ],

    allow_methods=[
        "*"
    ],

    allow_headers=[
        "*"
    ]

)



@app.on_event("startup")
def startup():

    start_scheduler()



@app.get("/")
def home():

    return {

        "name":
        "FloodWatch NY API",

        "status":
        "online"

    }



@app.get("/gauges")
def gauges():

    data = load_cache()


    if data is None:

        return {

            "error":
            "No data available"

        }


    return data