let searchMarker = null;


export function setupSearch(map) {

    const box =
    document.getElementById("searchBox");


    box.addEventListener("keypress", async (event)=>{


        if(event.key !== "Enter")
            return;


        const query = box.value;


        if(!query)
            return;



        const url =
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;


        const response =
        await fetch(url);


        const data =
        await response.json();



        if(data.length === 0){

            alert("Location not found");
            return;

        }



        const place = data[0];


        map.flyTo({

            center:[
                Number(place.lon),
                Number(place.lat)
            ],

            zoom:10

        });



        if(searchMarker){

            searchMarker.remove();

        }

        searchMarker = new maplibregl.Marker()

        .setLngLat([
            Number(place.lon),
            Number(place.lat)
        ])

        .addTo(map);


    });

}