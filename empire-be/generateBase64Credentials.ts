import { Buffer } from 'buffer';

const clientId: string =
  'AfZVWXTyz9tpHUHZft9zRYE6-mV__s6YfRhqK9yjGJAHVqEys7GBMgUFHJV9RgPlqoumobgUvlaeL0kz';
const clientSecret: string =
  'EAoHmH-JGNkFs67DAVVwJLaKEVNIcqAiNqjQpOmRcclylOsPZCD3Dw4B3PN9ijQWN561Z9AqU9it3Ezr';

const credentials: string = `${clientId}:${clientSecret}`;
const base64Credentials: string = Buffer.from(credentials).toString('base64');

console.log(`Base64-encoded credentials: ${base64Credentials}`);
