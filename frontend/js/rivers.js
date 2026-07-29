import { popupHTML } from "./popup.js";


export let riverFeatures = [];

const url =
    "https://weathertrackerbackend.onrender.com/gauges" +
    "?bbox.xmin=-79.9" +
    "&bbox.ymin=40.4" +
    "&bbox.xmax=-71.8" +
    "&bbox.ymax=42.9" +
    "&srid=EPSG_4326";
// const url =
//     // "http://oscclev.github.io/WeatherTrackerBackend/";
//     "https://floodwatch-api.onrender.com/gauges";


function getColor(category) {
    switch ((category || "").toLowerCase()) {

        case "missing":
            return "#8e8e8eff";

        case "major":
            return "#7b1fa2";

        case "moderate":
            return "#d32f2f";

        case "minor":
            return "#f57c00";

        case "action":
            return "#fdd835";

        default:
            return "#2e7d32";
    }
}

function getCategory(gauge) {

    const observed = gauge.status?.observed;

    // If there is no observation, this gauge is missing.
    if (
        !observed ||
        observed.primary == null ||
        observed.primary == -999
    ) {
        return "missing";
    }

    // If NOAA reports no flood category,
    // treat it as normal conditions.
    return observed.floodCategory || "normal";
}

function getForecastText(category) {

    switch ((category || "").toLowerCase()) {

        case "major":
            return "Major Flooding Expected";

        case "moderate":
            return "Moderate Flooding Expected";

        case "minor":
            return "Minor Flooding Expected";

        case "action":
            return "Near Flood Stage";

        case "normal":
        case "no_flooding":
            return "No Flooding Expected";

        case "fcst_not_current":
            return "Forecast Currently Unavailable";

        default:
            return "Forecast Unavailable";
    }

}

export async function loadRiverGauges(map) {

    console.log("Downloading gauges...");

    let data;

    try {

    const response = await fetch(url);

    data = await response.json();

    } catch (error) {

    console.error("Unable to load river gauges:", error);

    return;

    }   

    console.log(data);

    const geojson = {
        type: "FeatureCollection",
        features: []
    };

    console.log(data.gauges[0]);
    console.log(data.gauges[0].status.observed);
    console.log(data.gauges[0].status.forecast);


    for (const gauge of data.gauges) {

        if (
            gauge.latitude == null ||
            gauge.longitude == null
        ) continue;
        const category = getCategory(gauge);
        geojson.features.push({

            type: "Feature",

            geometry: {
                type: "Point",
                coordinates: [
                    gauge.longitude,
                    gauge.latitude
                ]
            },

            properties: {

                lid: gauge.lid,

                name: gauge.name,
                //This lets us hide the row later instead of displaying "Unknown."
                river: gauge.river || "Unknown",

                state: gauge.state?.abbreviation ?? "",

                currentStage:
                    gauge.status.observed.primary,

                currentUnit:
                    gauge.status.observed.primaryUnit,

                currentFlow:
                    gauge.status.observed.secondary,

                flowUnit:
                    gauge.status.observed.secondaryUnit,

                currentCategory: category,
            
                forecastCategory: getForecastText(
                    gauge.status?.forecast?.floodCategory
                ),

                updated:
                    gauge.status?.observed?.validTime ?? null,

                color: getColor(category)

            }

        });

    }

    riverFeatures = geojson.features;

    console.log("GeoJSON Features:", geojson.features.length);

    map.addSource("gauges", {

        type: "geojson",

        data: geojson

    });

    map.addLayer({

        id: "gauges",

        type: "circle",

        source: "gauges",

        paint: {

            "circle-radius": 6,

            "circle-color": ["get", "color"],

            "circle-stroke-width": 1,

            "circle-stroke-color": "#222"

        }

    });

    map.on("click", "gauges", (e) => {

        const p = e.features[0].properties;

        new maplibregl.Popup()

    .setLngLat(e.lngLat)

    .setHTML(
        popupHTML(e.features[0].properties)
    )

    .addTo(map);

    });

    map.on("mouseenter", "gauges", () => {

        map.getCanvas().style.cursor = "pointer";

    });

    map.on("mouseleave", "gauges", () => {

        map.getCanvas().style.cursor = "";

    });


}