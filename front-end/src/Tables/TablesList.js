import Table from "./Table";

function TablesList({ tables }) {
  return (
    <div className="row justify-content-center">
      {/* map through the tables list to access each individual table and display its component */}
      {tables.map((table) => (
        <Table table={table} key={table.table_id} />
      ))}
    </div>
  );
}

export default TablesList;
