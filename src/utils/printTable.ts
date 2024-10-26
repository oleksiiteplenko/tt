import Table from 'cli-table3';

type TableArgs = {
  headers: (string)[];
  rows: (string|number)[][];
};

export function printTable({ headers, rows }: TableArgs): void {
  const table = new Table({
    head: headers,
    style: { head: ['blue'] },
  });
  table.push(...rows);

  console.log(table.toString());
}
