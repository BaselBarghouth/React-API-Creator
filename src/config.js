const fs = require("fs");
const path = require("path");
module.exports = start = (id_es, Api, dataBaseNametables) => {
  const template_file_path = path.join(
    __dirname,
    "/database/template.config.js"
  );
  const template_route_file_path = path.join(__dirname, "./template.server.js");

  fs.readFile(template_file_path, { encoding: "utf-8" }, function(err, data) {
    if (!err) {
      writeToConfig(data);
    } else {
      console.log(err);
    }
  });

  const writeToConfig = file_content => {
    file_content = file_content.replace(
      "export const tables = {}",
      `export const tables = ${JSON.stringify(id_es)}`
    );

    file_content = file_content.replace(
      'export const dataBaseName = ""',
      `export const dataBaseName = "${dataBaseNametables}"`
    );
    fs.writeFile(__dirname + "/database/config.js", file_content, function(
      err
    ) {
      if (err) {
        return console.log(err);
      }

      console.log("The file was saved!");
    });
  };

  const writeToRoutes = file_content => {
    file_content = file_content.replace(
      "// start code",
      `// start code \n ${Api}`
    );

    fs.writeFile(__dirname + "/server.js", file_content, function(err) {
      if (err) {
        return console.log(err);
      }

      console.log("The file was saved!");
    });
  };

  const createRoutes = () => {
    fs.readFile(template_route_file_path, { encoding: "utf-8" }, function(
      err,
      data
    ) {
      if (!err) {
        console.log("received data: " + data);
        writeToRoutes(data);
      } else {
        console.log(err);
      }
    });
  };

  const createVariables = () => {
    fs.readFile(template_file_path, { encoding: "utf-8" }, function(err, data) {
      if (!err) {
        console.log("received data: " + data);
        writeToConfig(data);
      } else {
        console.log(err);
      }
    });
  };
  createRoutes();
  createVariables();
};
