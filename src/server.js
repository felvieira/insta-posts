const express = require(`express`);

const server = express();

server.use(express.json());

const posts = [
  {
    title: "Quote(1)",
    post:
      "Você é capaz do que a mente acredita. Quando mentaliza que é capaz, você vai muito mais longe! Não se sabote, acredite em você e vá. Alcance o inimaginável! Você pode tudo o que acredita!"
  },
  {
    title: "Quote(2)",
    post:
      "Suas crenças limitantes não podem definir quem você é. Acredite que você é capaz e seu corpo responderá da mesma forma. Seja uma pessoa que acredita em você, filtre as criticas e continue treinando e alcançando ainda mais!"
  }
];

server.use((req, res, next) => {
  console.time("Request");
  console.log(`Método: ${req.method}; URL: ${req.url}`);
  next();
  console.timeEnd("Request");
});

// Verify if Post exists in Array
function checkPostInArray(req, res, next) {
  const post = posts[req.params.index];

  if (!post) {
    return res.status(400).json({ error: "Post does not exists" });
  }

  req.post = post;

  return next();
}

function checkPostExistsInReq(req, res, next) {
  if (!req.body.title) {
    return res.status(400).json({ error: "Post title is required" });
  }

  if (!req.body.post) {
    return res.status(400).json({ error: "Post text is required" });
  }

  return next();
}

server.get("/posts", (req, res) => {
  return res.json(posts);
});

server.get("/posts/:index", checkPostInArray, (req, res) => {
  return res.json(req.post);
});

server.post("/posts", checkPostExistsInReq, (req, res) => {
  const post = req.body;

  posts.push(post);

  return res.json(posts);
});

server.put(
  "/posts/:index",
  checkPostInArray,
  checkPostExistsInReq,
  (req, res) => {
    const { index } = req.params;
    const post = req.body;

    posts[index] = post;

    return res.json(posts);
  }
);

server.delete("/posts/:index", checkPostInArray, (req, res) => {
  const { index } = req.params;

  posts.splice(index, 1);

  return res.send();
});

server.listen(3000);
