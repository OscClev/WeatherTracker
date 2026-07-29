export function setupFilters(map) {

    const checkboxes =
        document.querySelectorAll("#filters input");

    const selectAll =
        document.getElementById("selectAll");

    const clearAll =
        document.getElementById("clearAll");


    function updateFilter() {

        const visible = [];

        checkboxes.forEach(box => {

            if (box.checked) {

                visible.push(box.value);

            }

        });


        // Hide everything if no filters are selected
        if (visible.length === 0) {

            map.setFilter("gauges", ["==", ["get", "currentCategory"], "__none__"]);
            return;

        }


        map.setFilter("gauges", [

            "in",

            ["get", "currentCategory"],

            ["literal", visible]

        ]);

    }


    // Checkbox listeners
    checkboxes.forEach(box => {

        box.addEventListener("change", updateFilter);

    });


    // Select All button
    selectAll.addEventListener("click", () => {

        checkboxes.forEach(box => {

            box.checked = true;

        });

        updateFilter();

    });


    // Clear All button
    clearAll.addEventListener("click", () => {

        checkboxes.forEach(box => {

            box.checked = false;

        });

        updateFilter();

    });


    // Apply the default filter immediately
    updateFilter();

}