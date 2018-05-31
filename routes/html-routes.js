var path = require("path");

module.exports = function(app) {

    // Each of the below routes just handles the HTML page that the user gets sent to.
  
    // index route loads view.html
    app.get("/movie", function(req, res) {
      res.sendFile(path.join(__dirname, "../public/index.html"));
    });

  
    app.get("/dinner", function(req, res) {
      res.sendFile(path.join(__dirname, "../public/index_restaurant.html"));
    });
  
    // blog route loads blog.html
    // app.get("/plan", function(req, res) {
    //   res.sendFile(path.join(__dirname, "../public/index.html"));
    // });
  
  };