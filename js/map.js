export function createMap(){

    const map = new maplibregl.Map({

        container:"map",

        // style:"https://demotiles.maplibre.org/style.json",
        style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",

        center:[-75.5,42.9],

        zoom:6

    });

    map.addControl(new maplibregl.NavigationControl());

    return map;

}