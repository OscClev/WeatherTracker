function readableCategory(category){

    switch((category || "").toLowerCase()){


        case "missing":
            return {
                text:"NO DATA AVAILABLE",
                description:
                "This river gauge is currently unavailable.",
                class:"missing"
            };

        case "major":
            return {
                text:"Major Flooding",
                description:
                "Severe flooding is occurring. Dangerous conditions may exist.",
                class:"major"
            };


        case "moderate":
            return {
                text:"Moderate Flooding",
                description:
                "Flooding is affecting nearby areas. Monitor conditions closely.",
                class:"moderate"
            };


        case "minor":
            return {
                text:"Minor Flooding",
                description:
                "Minor flooding is occurring. Some low areas may be affected.",
                class:"minor"
            };


        case "action":
            return {
                text:"Near Flood Stage",
                description:
                "Water levels are elevated. Conditions should be monitored.",
                class:"action"
            };


        default:
            return {
                text:"Normal Conditions",
                description:
                "River levels are below flood stage.",
                class:"normal"
            };
    }

}



export function popupHTML(props){


    const status = readableCategory(
        props.currentCategory
    );


    const current =
        props.currentStage == -999 ||
        props.currentStage == null

        ? "Not available"

        : `${props.currentStage} ${props.currentUnit}`;



    const flow =
        props.currentFlow == -999 ||
        props.currentFlow == null

        ? "Not available"

        : `${props.currentFlow} ${props.flowUnit}`;



    const updated =
        props.updated

        ? new Date(props.updated)
            .toLocaleString()

        : "Not available";



return `

<div class="popup">


<h2>
${props.name ?? "River Gauge"}
</h2>



<div class="badge ${status.class}">
${status.text}
</div>


<p>
${status.description}
</p>



<table>


<tr>
<td><b>River</b></td>
<td>${props.river ?? "Unknown"}</td>
</tr>


<tr>
<td><b>Location</b></td>
<td>${props.state ?? ""}</td>
</tr>


<tr>
<td><b>Current Level</b></td>
<td>${current}</td>
</tr>


<tr>
<td><b>River Flow</b></td>
<td>${flow}</td>
</tr>


<tr>
<td><b>Forecast</b></td>
<td>${props.forecastCategory ?? "Not available"}</td>
</tr>


<tr>
<td><b>Last Updated</b></td>
<td>${updated}</td>
</tr>


</table>


<p class="source">
Data provided by NOAA River Forecast Center
</p>


</div>

`;

}