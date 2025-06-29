const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5173;

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "eanaplirotes",
  password: "eanaplirotes2023",
  database: "eanaplirotes",
  port: "3306",
});

connection.connect((error) => {
  if (error) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1); // Exit the application if the database connection fails
  }
  console.log("Successfully connected to the database");
});

// app.use(cors({ origin: "http://localhost:5173" }));
app.use(cors());
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.post("/api/anaplirotes", (req, res) => {
  try {
    const { name } = req.body;
    const parts = name.split(" ");
    const whereClauses = parts.map(
      (part) => `CONCAT(Eponymo, ' ', Onoma) LIKE '%${part}%'`
    );
    const whereClause = whereClauses.join(" AND ");
    const query = `SELECT DISTINCT CONCAT(Eponymo, ' ', Onoma) AS FULLNAME FROM Anaplirotes WHERE ${whereClause} LIMIT 10`;

    connection.query(query, (error, result) => {
      if (error) {
        console.error("Database query error:", error);
        return res.status(500).send("Internal Server Error");
      }

      const fullNames = result.map((anaplirotes) => anaplirotes.FULLNAME);
      res.send(fullNames);
    });
  } catch (error) {
    console.error("Error in API endpoint /api/anaplirotes:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/user/:Eponymo/:Onoma/:Patronymo", (req, res) => {
  try {
    const { Eponymo, Onoma, Patronymo } = req.params;
    const query = `SELECT * FROM Anaplirotes WHERE Anaplirotes.eponymo='${Eponymo}' AND Anaplirotes.onoma='${Onoma}' AND Anaplirotes.Patronymo='${Patronymo}'`;
    connection.query(query, (error, result) => {
      if (error) {
        console.error("Database query error:", error);
        return res.status(500).send("Internal Server Error");
      }
      res.send(result);
    });
  } catch (error) {
    console.error(
      "Error in API endpoint /api/user/:Eponymo/:Onoma/:Patronymo",
      error
    );
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/klados/:id", (req, res) => {
  try {
    const { id } = req.params;
    const query = `SELECT COUNT(*) as countanaplirotes FROM  Anaplirotes WHERE Anaplirotes.klados='${id}';`;
    connection.query(query, (error, result) => {
      if (error) {
        console.error("Database query error:", error);
        return res.status(500).send("Internal Server Error");
      }
      res.send(result);
    });
  } catch (error) {
    console.error(
      "Error in API endpoint /api/user/:Eponymo/:Onoma/:Patronymo",
      error
    );
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/sortTest", (req, res) => {
  const query = "SELECT * FROM Anaplirotes ORDER BY Moria_Pinaka DESC;";
  connection.query(query, (error, result) => {
    if (error) throw error;
    res.send(result);
  });
});

app.get("/api/onoma/:id", (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const newId = id.toUpperCase().split("_");
    console.log("newId", newId);
    const query = `SELECT * FROM Anaplirotes WHERE Anaplirotes.Eponymo='${String(
      newId[0]
    )}' AND Anaplirotes.Onoma='${String(newId[1])}'`;
    console.log(query);
    connection.query(query, (error, result) => {
      if (error) {
        console.error("Database query error:", error);
        return res.status(500).send("Internal Server Error");
      }
      res.send(result);
    });
  } catch (error) {
    console.error(
      "Error in API endpoint /api/user/:Eponymo/:Onoma/:Patronymo",
      error
    );
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/typos", (req, res) => {
  try {
    const query = "SELECT DISTINCT Typos FROM Anaplirotes";
    connection.query(query, (error, result) => {
      if (error) {
        console.error("Database query error:", error);
        return res.status(500).send("Internal Server Error");
      }
      const typos = result.map((item) => item.Typos);
      res.send(typos);
    });
  } catch (error) {
    console.error(
      "Error in API endpoint /api/user/:Eponymo/:Onoma/:Patronymo",
      error
    );
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/klados", (req, res) => {
  try {
    const query = "SELECT DISTINCT Klados FROM Anaplirotes";
    connection.query(query, (error, result) => {
      if (error) {
        console.error("Database query error:", error);
        return res.status(500).send("Internal Server Error");
      }
      const klados = result.map((item) => item.Klados);
      res.send(klados);
    });
  } catch (error) {
    console.error(
      "Error in API endpoint /api/user/:Eponymo/:Onoma/:Patronymo",
      error
    );
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/perioxh", (req, res) => {
  try {
    const query = "SELECT DISTINCT Perioxh_Topothethshs FROM Anaplirotes";
    connection.query(query, (error, result) => {
      if (error) {
        console.error("Database query error:", error);
        return res.status(500).send("Internal Server Error");
      }
      const perioxh = result.map((item) => item.Perioxh_Topothethshs);
      res.send(perioxh);
    });
  } catch (error) {
    console.error(
      "Error in API endpoint /api/user/:Eponymo/:Onoma/:Patronymo",
      error
    );
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/dieythynsh", (req, res) => {
  try {
    const query = "SELECT DISTINCT Dieytynsh_Ekpaideyshs FROM Anaplirotes";
    connection.query(query, (error, result) => {
      if (error) {
        console.error("Database query error:", error);
        return res.status(500).send("Internal Server Error");
      }
      const dieythynsh = result
        .map((item) => item.Dieytynsh_Ekpaideyshs)
        .filter((value) => value !== "-");
      res.send(dieythynsh);
    });
  } catch (error) {
    console.error(
      "Error in API endpoint /api/user/:Eponymo/:Onoma/:Patronymo",
      error
    );
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/search", (req, res) => {
  try {
    const { typos, klados, perioxh, dieythynsh } = req.query;

    const conditions = [
      typos && `Typos IN ('${typos}')`,
      klados && `Klados IN ('${klados}')`,
      perioxh &&
        `Perioxh_Topothethshs IN (${perioxh.map((p) => `'${p}'`).join(", ")})`,
      dieythynsh && `Dieytynsh_Ekpaideyshs IN ('${dieythynsh}')`,
    ].filter(Boolean);

    const whereClause =
      conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";
    const query = `SELECT * FROM Anaplirotes ${whereClause} ORDER BY Etos ASC`;

    connection.query(query, (error, results) => {
      if (error) {
        console.error("Database query error:", error);
        return res.status(500).send({ error: "Internal Server Error" });
      }

      let anaplirotesCount = {
        labels: [],
        datasets: [],
      };

      let moriaPinakaStructure = {
        labels: [],
        datasets: [],
      };

      let labelParts = [];
      if (typos) labelParts.push(typos);
      if (klados) labelParts.push(klados);
      if (dieythynsh) labelParts.push(dieythynsh);

      // Since perioxh is always an array, we can directly use it.
      if (perioxh) {
        perioxh.forEach((area) => {
          let dataset = {
            label: `${area}, ${labelParts.join(", ")}`.trim(),
            data: [],
          };
          let areaData = results.filter(
            (result) => result.Perioxh_Topothethshs === area
          );
          let groupedData = groupByYear(areaData);
          if (Object.keys(groupedData).length > 0) {
            anaplirotesCount.labels = Object.keys(groupedData);
            dataset.data = Object.values(groupedData);
            anaplirotesCount.datasets.push(dataset);
          }
          // Min Moria_Pinaka logic
          if (klados) {
            let minMoriaDataset = {
              label: `${area}, ${labelParts.join(", ")}`.trim(),
              data: [],
            };
            let minMoriaData = getMinMoriaByYear(areaData);
            if (Object.keys(minMoriaData).length > 0) {
              moriaPinakaStructure.labels = Object.keys(minMoriaData);
              minMoriaDataset.data = Object.values(minMoriaData);
              moriaPinakaStructure.datasets.push(minMoriaDataset);
            }
          }
        });
      } else {
        let groupedData = groupByYear(results);
        anaplirotesCount.labels = Object.keys(groupedData);
        let dataset = {
          label: labelParts.join(", "),
          data: Object.values(groupedData),
        };
        anaplirotesCount.datasets.push(dataset);
      }

      let response = {
        anaplirotesCount: anaplirotesCount,
      };

      // If moriaPinakaStructure has data and klados is specified, include it in the response
      if (moriaPinakaStructure.datasets.length > 0 && klados) {
        response.minMoria = moriaPinakaStructure;
      }

      res.send(response);
    });
  } catch (error) {
    console.error("Error in API endpoint /api/search:", error);
    res.status(500).send("Internal Server Error");
  }
});

function getMinMoriaByYear(data) {
  return data.reduce((acc, item) => {
    const etos = item.Etos;
    if (!acc[etos]) {
      acc[etos] = item.Moria_Pinaka;
    } else {
      acc[etos] = Math.min(acc[etos], item.Moria_Pinaka);
    }
    return acc;
  }, {});
}

function generateConditions({ typos, klados, perioxh, dieythynsh }) {
  const inCondition = (column, value) => {
    if (!value) return null;
    return `${column} IN (${
      Array.isArray(value)
        ? value.map((v) => `'${v}'`).join(", ")
        : `'${value}'`
    })`;
  };

  return [
    inCondition("Typos", typos),
    inCondition("Klados", klados),
    inCondition("Perioxh_Topothethshs", perioxh),
    inCondition("Dieytynsh_Ekpaideyshs", dieythynsh),
  ].filter(Boolean);
}

function groupByYear(data) {
  return data.reduce((acc, item) => {
    const etos = item.Etos;
    if (!acc[etos]) {
      acc[etos] = 0;
    }
    acc[etos]++;
    return acc;
  }, {});
}

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
