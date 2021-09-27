import React, { useEffect } from "react";

import "slickgrid/slick.core";
import "slickgrid/lib/jquery.event.drag-2.3.0";
import "slickgrid/slick.grid";
import "slickgrid/slick.grid.css";

const ROOT_ID = "slick";

const data = [
    { name: "Axel", age: 23 },
    { name: "Christopher", age: 22 },
];

const columns: Array<Slick.Column<typeof data>> = [
    { id: "name", name: "Name", field: "name", width: 500 },
    { id: "age", name: "Age", field: "age", width: 500 },
];

const options = {
    enableCellNavigation: true,
    enableColumnReorder: false,
};

const Slickgrid: React.FC = () => {
    useEffect(() => {
        const grid = new Slick.Grid("#" + ROOT_ID, data, columns, options);
    });

    return <div id={ROOT_ID} style={{ width: "100vw", height: "100vh" }} />;
};
export default Slickgrid;
