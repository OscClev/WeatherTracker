let searchMarker = null;

import { riverFeatures } from "./rivers.js";
import { popupHTML } from "./popup.js";


function distance(lat1, lon1, lat2, lon2) {

    const R = 6371; // kilometers

    const dLat =
        (lat2 - lat1) * Math.PI / 180;

    const dLon =
        (lon2 - lon1) * Math.PI / 180;


    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;


    return R * 2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

}



export function setupSearch(map) {


    const box =
        document.getElementById("searchBox");


    box.addEventListener("keypress", async (event) => {


        if(event.key !== "Enter")
            return;


        const query =
            box.value.trim();


        if(!query)
            return;



        // Search for location

        const url =
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;



        const response =
            await fetch(url);



        const data =
            await response.json();



        if(data.length === 0){

            alert("Location not found");

            return;

        }



        const place =
            data[0];



        const lat =
            Number(place.lat);


        const lon =
            Number(place.lon);



        // Move map

        map.flyTo({

            center:[
                lon,
                lat
            ],

            zoom:10

        });



        // Remove old search marker

        if(searchMarker){

            searchMarker.remove();

        }



        // Add new search marker

        searchMarker =
            new maplibregl.Marker()

            .setLngLat([
                lon,
                lat
            ])

            .addTo(map);





        // Find nearest gauges

        const nearby =
            riverFeatures

            .map(feature => {


                const coords =
                    feature.geometry.coordinates;


                return {

                    feature,

                    distance:
                    distance(

                        lat,
                        lon,

                        coords[1],
                        coords[0]

                    )

                };


            })


            .sort((a,b)=>{

                return a.distance - b.distance;

            })


            .slice(0,5);





        // Display nearby gauges

        const container =
            document.getElementById(
                "searchResults"
            );


        if(!container)
            return;



        container.innerHTML = "";



        if(nearby.length === 0){

            container.innerHTML =
            "No nearby gauges found.";

            return;

        }



        nearby.forEach(gauge => {


            const props =
                gauge.feature.properties;



            const div =
                document.createElement("div");



            div.className =
                "nearbyGauge";



            div.innerHTML = `

                <strong>
                    ${props.name}
                </strong>

                <br>

                ${props.river}

                <br>

                ${gauge.distance.toFixed(1)}
                km away

                <br>

                Status:
                
                ${props.currentCategory}

            `;



            div.addEventListener("click",()=>{


                const coords =
                    gauge.feature.geometry.coordinates;



                map.flyTo({

                    center:coords,

                    zoom:11

                });



                new maplibregl.Popup()

                    .setLngLat(coords)

                    .setHTML(
                        popupHTML(props)
                    )

                    .addTo(map);


            });



            container.appendChild(div);



        });



    });


}