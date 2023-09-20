const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5173;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "anaplirotesTEST",
});

connection.connect((error) => {
  if (error) throw error;
  console.log("Successfully connected to the database");
});

// app.use(cors({ origin: "http://localhost:5173" }));
app.use(cors());
const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.post("/anaplirotes", (req, res) => {
  const { name } = req.body;
  const parts = name.split(" ");
  const whereClauses = parts.map(
    (part) => `CONCAT(Eponymo, ' ', Onoma) LIKE '%${part}%'`
  );
  const whereClause = whereClauses.join(" AND ");
  const query = `SELECT DISTINCT CONCAT(Eponymo, ' ', Onoma) AS FULLNAME FROM anaplirotes WHERE ${whereClause} LIMIT 10`;
  connection.query(query, (error, result) => {
    if (error) throw error;
    const fullNames = result.map((anaplirotes) => anaplirotes.FULLNAME);
    res.send(fullNames);
  });
});

app.get("/user/:Eponymo/:Onoma/:Patronymo", (req, res) => {
  const { Eponymo, Onoma, Patronymo } = req.params;
  const query = `SELECT * FROM anaplirotes WHERE anaplirotes.eponymo='${Eponymo}' AND anaplirotes.onoma='${Onoma}' AND anaplirotes.Patronymo='${Patronymo}'`;
  connection.query(query, (error, result) => {
    if (error) throw error;
    res.send(result);
  });
});

app.get("/klados/:id", (req, res) => {
  const { id } = req.params;
  const query = `SELECT COUNT(*) as countanaplirotes FROM  anaplirotes WHERE anaplirotes.klados='${id}';`;
  connection.query(query, (error, result) => {
    if (error) throw error;
    res.send(result);
  });
});

app.get("/sortTest", (req, res) => {
  const query = "SELECT * FROM anaplirotes ORDER BY Moria_Pinaka DESC;";
  connection.query(query, (error, result) => {
    if (error) throw error;
    res.send(result);
  });
});

app.get("/onoma/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);
  const newId = id.toUpperCase().split("_");
  console.log("newId", newId);
  const query = `SELECT * FROM anaplirotes WHERE anaplirotes.Eponymo='${String(
    newId[0]
  )}' AND anaplirotes.Onoma='${String(newId[1])}'`;
  console.log(query);
  connection.query(query, (error, result) => {
    if (error) throw error;
    res.send(result);
  });
});

app.get("/typos", (req, res) => {
  const query = "SELECT DISTINCT Typos FROM anaplirotes";
  connection.query(query, (error, result) => {
    if (error) throw error;
    const typos = result.map((item) => item.Typos);
    res.send(typos);
  });
});

app.get("/klados", (req, res) => {
  const query = "SELECT DISTINCT Klados FROM anaplirotes";
  connection.query(query, (error, result) => {
    const klados = result.map((item) => item.Klados);
    res.send(klados);
  });
});

app.get("/perioxh", (req, res) => {
  const query = "SELECT DISTINCT Perioxh_Topothethshs FROM anaplirotes";
  connection.query(query, (error, result) => {
    if (error) throw error;
    const perioxh = result.map((item) => item.Perioxh_Topothethshs);
    res.send(perioxh);
  });
});

app.get("/dieythynsh", (req, res) => {
  const query = "SELECT DISTINCT Dieytynsh_Ekpaideyshs FROM anaplirotes";
  connection.query(query, (error, result) => {
    if (error) throw error;
    const dieythynsh = result
      .map((item) => item.Dieytynsh_Ekpaideyshs)
      .filter((value) => value !== "-");
    res.send(dieythynsh);
  });
});

app.get("/search", (req, res) => {
  const { typos, klados, perioxh, dieythynsh } = req.query;

  const conditions = [
    typos && `Typos IN ('${typos}')`,
    klados && `Klados IN ('${klados}')`,
    perioxh && `Perioxh_Topothethshs IN (${perioxh.map((p) => `'${p}'`).join(", ")})`,
    dieythynsh && `Dieytynsh_Ekpaideyshs IN ('${dieythynsh}')`,
  ].filter(Boolean);

  const whereClause =
    conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";
  const query = `SELECT * FROM anaplirotes ${whereClause} ORDER BY Etos ASC`;

  connection.query(query, (error, results) => {
    if (error) {
      return res.status(500).send({ error });
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
