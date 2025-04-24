function status(request, response) {
  response
    .status(200)
    .json({ chave: "testando a função response.status(200).send()" });
}

export default status;
