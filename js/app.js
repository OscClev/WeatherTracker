import { createMap } from "./map.js";
import { loadRiverGauges } from "./rivers.js";

window.addEventListener("load", () => {
    const map = createMap();

    map.on("load", async () => {
        console.log("Map loaded");

        await loadRiverGauges(map);

        console.log("Finished loading gauges");
    });
});