interface CheckCondition {
  format?: string[];
  size?: number;
}
type ErrorType = "format" | "size" | null;
export const beforeUploadCheck = (file: File, condition: CheckCondition) => {
  const { format, size } = condition;
  const isValidFormat = format ? format.includes(file.type) : true;
  const isValidSize = size ? file.size / 1024 / 1024 < size : true;
  let error: ErrorType = null;

  if (!isValidFormat) {
    error = "format";
  } else if (!isValidSize) {
    error = "size";
  }
  return {
    passed: isValidFormat && isValidSize,
    error,
  };
};

import { ColumnProps, UserProps } from "./store";
import imgUrl from "./assets/avatar.jpg";
export function generateFitUrl(
  column: ColumnProps,
  width: number,
  height: number
) {
  if (column.avatar) {
    column.avatar.fitUrl =
      column.avatar.url +
      `?x-oss-process=image/resize,m_pad,h_${height},w_${width}`;
  } else {
    column.avatar = {
      fitUrl: `${imgUrl}?x-oss-process=image/resize,m_pad,h_100,w_200`,
    };
  }
}

export function addColumnAvatar(
  data: ColumnProps | UserProps,
  width: number,
  height: number
) {
  if (data.avatar) {
    generateFitUrl(data.avatar, width, height);
  } else {
    const parseCol = data as ColumnProps;
    data.avatar = {
      fitUrl: require(parseCol.title
        ? "@/assets/column.jpg"
        : "@/assets/avatar.jpg"),
    };
  }
}

export const arrToObj = <T extends { _id?: string }>(arr: Array<T>) => {
  return arr.reduce((prev, current) => {
    if (current._id) {
      prev[current._id] = current;
    }
    return prev;
  }, {} as { [key: string]: T });
};

export const objToArr = <T>(obj: { [key: string]: T }) => {
  return Object.keys(obj).map((key) => obj[key]);
};
