import database from "infra/database.js";

export default async function testRanna(request, response) {

  response.status(200).json({
    test: "testando",
    message: "Hello, Ranna",


 });
}
