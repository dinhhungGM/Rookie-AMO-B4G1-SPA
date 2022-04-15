import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useTable, useSortBy } from "react-table";

function Table({ columns, data, onRowClick, onSort }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { sortBy },
  } = useTable(
    {
      columns,
      data,
      manualSortBy: true,
    },
    useSortBy,
  );
  const { sort: Sort, desc: Desc } = useSelector((state) => state.user); // We don't want to render all 2000 rows for this example, so cap
  const ConvertDate = (date) => {
    if (date) {
      const array = date.split("/");
      return array[1] + "/" + array[0] + "/" + array[2];
    }
  };
  // it at 20 for this use case
  const firstPageRows = rows;
  useEffect(() => {
    onSort(sortBy);
  }, [sortBy]);
  return (
    <>
      <table class="table" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr className="" {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                // column.getSortByToggleProps()
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.id === Sort ? (
                      Desc ? (
                        " ▼"
                      ) : (
                        " ▲"
                      )
                    ) : (
                      <span style={{ opacity: 0 }}> ▼</span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {firstPageRows.map((row, i) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                onClick={() => onRowClick(row.original)}
              >
                {row.cells.map((cell) => {
                  return (
                    <>
                      {cell.column.Header !== " " ? (
                        cell.column.Header === "Joined Date" ? (
                          <>
                            <td {...cell.getCellProps()}>
                              {ConvertDate(cell.value)}
                            </td>
                          </>
                        ) : (
                          <td {...cell.getCellProps()}>
                            {String(cell.value).substring(0, 20) +
                              (String(cell.value).length > 20 ? "..." : "")}
                          </td>
                        )
                      ) : (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      )}
                    </>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
    </>
  );
}
export default Table;
