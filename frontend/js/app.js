import { createMap } from "./map.js";
import { loadRiverGauges } from "./rivers.js";
import { setupSearch } from "./search.js";


window.addEventListener("load", () => {

    const map = createMap();

    setupSearch(map);

    map.on("load", async () => {

        console.log("Map loaded");

        await loadRiverGauges(map);

        console.log("Finished loading gauges");

    });

});