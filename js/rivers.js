import { popupHTML } from "./popup.js";

//Bounding box in latitude and longitude for the regions being searche
// const url =
//     "https://api.water.noaa.gov/nwps/v1/gauges" +
//     "?bbox.xmin=-82" +
//     "&bbox.ymin=39" +
//     "&bbox.xmax=-67" +
//     "&bbox.ymax=48" +
//     "&srid=EPSG_4326";

const url =
    "https://api.water.noaa.gov/nwps/v1/gauges" +
    "?bbox.xmin=-79.9" +
    "&bbox.ymin=40.4" +
    "&bbox.xmax=-71.8" +
    "&bbox.ymax=45.2" +
    "&srid=EPSG_4326";

// const url =
//     "https://api.water.noaa.gov/nwps/v1/gauges" +
//     "?bbox.xmin=-80.52" +
//     "&bbox.ymin=39.72" +
//     "&bbox.xmax=-74.68" +
//     "&bbox.ymax=42.26" +
//     "&srid=EPSG_4326";


//MAYBE GET RID OF?
function getColor(category) {
    switch ((category || "").toLowerCase()) {

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

export async function loadRiverGauges(map) {

    console.log("Downloading gauges...");

    const response = await fetch(url);

    const data = await response.json();

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

                river: gauge.river ?? "Unknown",

                state: gauge.state?.abbreviation ?? "",

                currentStage:
                    gauge.status.observed.primary,

                currentUnit:
                    gauge.status.observed.primaryUnit,

                currentFlow:
                    gauge.status.observed.secondary,

                flowUnit:
                    gauge.status.observed.secondaryUnit,

                currentCategory:
                    gauge.status.observed.floodCategory,

                forecastCategory:
                    gauge.status.forecast.floodCategory,

                updated:
                    gauge.status.observed.validTime,

                color: getColor(
                    gauge.status.observed.floodCategory
                )

            }

        });

    }

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