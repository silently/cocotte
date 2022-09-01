// lib
import * as R from "ramda";

export const getBrowsableMap = (index: { [key: string]: SubTable }): BrowsableMap => {
  const containers = R.values(index);
  const minX = Math.min(...R.map(({ offset: { x } }) => x, containers));
  const maxX =
    Math.max(
      ...R.map(({ offset: { x }, matrix }) => x + matrix[0].length, containers)
    ) - 1;
  const minY = Math.min(...R.map(({ offset: { y } }) => y, containers));
  const maxY =
    Math.max(
      ...R.map(({ offset: { y }, matrix }) => y + matrix.length, containers)
    ) - 1;
  const size = { x: maxX - minX + 1, y: maxY - minY + 1 };
  const output = {
    offset: { x: minX, y: minY },
    size: size,
    matrix: Array(size.y)
      .fill(false)
      .map(() => Array(size.x).fill(false)),
  };
  containers.forEach(({ matrix, accessor, offset }) => {
    matrix.forEach((line, y) => {
      line.forEach((element, x) => {
        if (element)
          output.matrix[y + offset.y - minY][x + offset.x - minX] = {
            type: accessor,
            value: element,
          };
      });
    });
  });
  return output;
};

export const getProperty = (
  { matrix, offset }: BrowsableMap,
  point: Point
): any => matrix[point.y - offset.y][point.x - offset.x];
