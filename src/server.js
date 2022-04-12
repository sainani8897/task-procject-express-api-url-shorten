const express = require("express");
const app = express();
const port = 3000;

const shortUrl = require("node-url-shortener");
var TinyURL = require("tinyurl");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/", (req, res) => {
  // res.send("Hello World!");
  console.log(req.body);
  if (req.body) {
    const data = req.body;
    if (data.url && validURL(data.url)) {
      //   shortUrl.short(data.url, function (err, url) {
      //     if (err) {
      //         res.send(err);
      //     }
      //     res.send({
      //         status:200,
      //         data:{
      //             url
      //         }
      //     })
      //   });

      TinyURL.shorten(data.url, function (url, err) {
        if (err) {
          res.send(err);
        }
        res.send({
          status: 200,
          data: {
            url,
          },
        });
      });
    } else {
      return res.send({
        error: "give a valid url",
      });
    }
  }
});

function validURL(str) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
