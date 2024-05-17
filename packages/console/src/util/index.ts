import exp from "constants";

export const isDown = (data: Buffer, key: string) => {
  if (key === 's' || key === 'S') {
    return true;
  }
  return data[0] === 27 && data[1] === 91 && data[2] === 66;
}

export const isUp = (data: Buffer, key: string) => {
  if (key === 'w' || key === 'W') {
    return true;
  }
  return data[0] === 27 && data[1] === 91 && data[2] === 65;
}

export const isLeft = (data: Buffer, key: string) => {
  if (key === 'a' || key === 'A') {
    return true;
  }
  return data[0] === 27 && data[1] === 91 && data[2] === 68;
}

export const isRight = (data: Buffer, key: string) => {
  if (key === 'd' || key === 'D') {
    return true;
  }
  return data[0] === 27 && data[1] === 91 && data[2] === 67;
}

export const toFullNumber = (num: number) => {
  const str = num.toString();
  return str.split('').map((char) => {
    return String.fromCharCode(65296 + parseInt(char));
  }).join('');
}