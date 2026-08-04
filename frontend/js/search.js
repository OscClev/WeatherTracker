let searchMarker = null;
let searchTimeout = null;

import { riverFeatures } from "./rivers.js";
import { popupHTML } from "./popup.js";


export function setupSearch(map) {

    const box =
        document.getElementById("searchBox");

    const results =
        document.getElementById("searchResults");


    box.addEventListener("input", () => {


        clearTimeout(searchTimeout);


        const query =
            box.value.trim();


        if(query.length < 3){

            results.innerHTML = "";

            return;

        }



        searchTimeout = setTimeout(async()=>{


            results.innerHTML = "";


            const lower =
                query.toLowerCase();



            // Search river gauges first

            const gaugeMatches =
                riverFeatures

                .filter(feature=>{

                    const props =
                        feature.properties;


                    return (

                        props.name
                        ?.toLowerCase()
                        .includes(lower)

                        ||

                        props.river
                        ?.toLowerCase()
                        .includes(lower)

                    );

                })

                .slice(0,5);



            gaugeMatches.forEach(feature=>{


                createResult(

                    `${feature.properties.name}
                     <br>
                     🌊 ${feature.properties.river}`,

                    ()=>{


                        const coords =
                            feature.geometry.coordinates;


                        map.flyTo({

                            center:coords,

                            zoom:11

                        });



                        new maplibregl.Popup()

                        .setLngLat(coords)

                        .setHTML(
                            popupHTML(
                                feature.properties
                            )
                        )

                        .addTo(map);


                    }

                );


            });



            // If no gauges match, search locations

            if(gaugeMatches.length === 0){


                const url =
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&viewbox=-79.9,42.9,-71.8,40.4&bounded=1`;


                const response =
                    await fetch(url);


                const places =
                    await response.json();



                places.slice(0,5)
                .forEach(place=>{


                    createResult(

                        `📍 ${place.display_name}`,

                        ()=>{


                            const coords=[

                                Number(place.lon),

                                Number(place.lat)

                            ];



                            map.flyTo({

                                center:coords,

                                zoom:10

                            });



                            if(searchMarker){

                                searchMarker.remove();

                            }



                            searchMarker =
                            new maplibregl.Marker()

                            .setLngLat(coords)

                            .addTo(map);


                        }

                    );


                });

            }


        },300);


    });



    function createResult(text, callback){


        const div =
            document.createElement("div");


        div.className =
            "searchResult";


        div.innerHTML =
            text;


        div.addEventListener(
            "click",
            callback
        );


        results.appendChild(div);

    }

}