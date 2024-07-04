export default function getOriginList() {
  return process.env.WHITELIST ? process.env.WHITELIST.split(',') : [];
}
