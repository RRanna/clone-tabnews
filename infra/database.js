import { Client } from "pg";

async function query(queryObject) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    //verificação de SSL
    ssl: getSSLValue(),
  });

  try {
    await client.connect();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.end();
  }
}

export default {
  query: query,
};

//Função de verificação de SSL
function getSSLValue() {
  //se houver um certificado autoassinado, como no caso dos serviços da DigitalOcean
  if (process.env.POSTGRES_CA) {
    return { ca: process.env.POSTGRES_CA };
  }
  //se o ambiente for de desenvolvimento, o SSL deve retornar falso; se for ambiente
  // de produção, o SSL retorna true, conforme requerido pelo servidor de BDMS.
  return process.env.NODE_ENV === "development" ? false : true;
}
