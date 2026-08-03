export const readFileSync = () => '';
export const existsSync = () => false;
export const statSync = () => ({ size: 0, isDirectory: () => false });
export const promises = {
  readFile: async () => '',
  stat: async () => ({ size: 0, isDirectory: () => false }),
  access: async () => {},
};
export const readdirSync = () => [];
export const mkdirSync = () => {};
export const writeFileSync = () => {};

export default {
  readFileSync,
  existsSync,
  statSync,
  promises,
  readdirSync,
  mkdirSync,
  writeFileSync,
};
