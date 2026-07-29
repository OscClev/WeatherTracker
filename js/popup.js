export function popupHTML(props){

    const current =
        props.currentStage == -999
        ? "--"
        : `${props.currentStage} ${props.currentUnit}`;

    const flow =
        props.currentFlow == -999
        ? "--"
        : `${props.currentFlow} ${props.flowUnit}`;

    return `

<div class="popup">

<h2>${props.name}</h2>

<div class="badge ${props.currentCategory}">
${props.currentCategory.replace("_"," ").toUpperCase()}
</div>

<table>

<tr>

<td><b>Station</b></td>

<td>${props.lid}</td>

</tr>

<tr>

<td><b>River</b></td>

<td>${props.river}</td>

</tr>

<tr>

<td><b>Stage</b></td>

<td>${current}</td>

</tr>

<tr>

<td><b>Flow</b></td>

<td>${flow}</td>

</tr>

<tr>

<td><b>Forecast</b></td>

<td>${props.forecastCategory}</td>

</tr>

<tr>

<td><b>Updated</b></td>

<td>${new Date(props.updated).toLocaleString()}</td>

</tr>

</table>

</div>

`;
}