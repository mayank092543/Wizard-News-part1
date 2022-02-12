const express = require("express");
const morgan = require("morgan");
const app = express();
const postBank = require("./postBank");

app.use(express.static("public"));
app.use(morgan("dev"));

app.get("/", (request, response) => {
  const posts = postBank.list();
  console.log(posts)

  const html = `<DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      ${posts.map(post => `
        <div class='news-item'>
          <p>
            <span class="news-position">${post.id}. ▲</span><a href="/posts/${post.id}">${post.title}</a>
            <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
          </small>
        </div>`
      ).join('')}
    </div>
  </body>
</html>`;

  response.send(html);
});

app.get("/posts/:id", (request, response) => {
  const id = request.params.id; 
  const post = postBank.find(id);

  if (!post[0].id) {
    // if the post wasn't found, set the HTTP status to 404 and Not Found HTML

    response.status(404)

    const html =`
    <!DOCTYPE HTML>
    <html>
    <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <header><img src="/logo.png"/>Wizard News</header>
      <div class="not-found">
        <p>Accio Page! 🧙‍♀️ ... Page Not Found</p>
        <img src="/dumbledore-404.gif" />
      </div>
    </body>
    </html>`
    response.send(html)
  } else {

  const html1 =`<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
       ${post.map(post => `
        <div class='news-item'>
          <p>
            <span class="news-position">${post.id}. ▲</span>${post.title}
            <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
          </small>
        </div>`
      ).join('')}
    </div>
  </body>
</html>`
response.send(html1)
}
  
  
})


const { PORT = 1337 } = process.env;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
