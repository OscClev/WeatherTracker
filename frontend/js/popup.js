function readableCategory(category){

    switch((category || "").toLowerCase()){


        case "missing":
            return {
                text:"Data Unavailable",
                description:
                "This gauge is not currently reporting observations.",
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

    const rows = [];


    // Only show state if it exists
    if (props.state) {

        rows.push(`
            <tr>
                <td><b>Location</b></td>
                <td>${props.state}</td>
            </tr>
        `);

    }


    // Only show stage if available
    if (current !== "Not available") {

        rows.push(`
            <tr>
                <td><b>Current Level</b></td>
                <td>${current}</td>
            </tr>
        `);

    }


    // Only show flow if available
    if (flow !== "Not available") {

        rows.push(`
            <tr>
                <td><b>River Flow</b></td>
                <td>${flow}</td>
            </tr>
        `);

    }


    // Only show forecast if it's meaningful
    if (
        props.forecastCategory &&
        (props.forecastCategory !== "Forecast Unavailable" && props.forecastCategory !== "Forecast Currently Unavailable")
    ) {

        rows.push(`
            <tr>
                <td><b>Forecast</b></td>
                <td>${props.forecastCategory}</td>
            </tr>
        `);

    }


    // Only show update time if available
    if (updated !== "Not available") {

        rows.push(`
            <tr>
                <td><b>Last Updated</b></td>
                <td>${updated}</td>
            </tr>
        `);

    }


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

${rows.join("")}

</table>


<p class="source">
Data provided by NOAA River Forecast Center
</p>


</div>

`;

}