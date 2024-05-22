const express = require("express");
const app = express();

const fileUpload = require("express-fileupload");
const fs = require("fs");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.use(fileUpload());

//////// ardis  ////////////////////////////

app.post("/testimagenOLD", async (req, res) => {
  let sampleFile;
  let uploadPath;

  sampleFile = req.files.sampleFile;

  uploadPath = `./public/uploads/coohom.json`;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  let xxx;

  sampleFile.mv(uploadPath, async (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }

    let rawdata = fs.readFileSync(uploadPath);
    //let filename = generateRandomNumber();
    let filename = "ardis";

    let jsonCabinets = JSON.parse(rawdata);

    const cabinets = jsonCabinets.bomPlanks;

    let parts = "";
    let sequence = 0;

    cabinets.forEach((jsonNode) => {
      sequence = sequence + 1;
      parts = parts + String(GenerateArdisXML(jsonNode, sequence));
    });

    var filepath = "./public/" + filename + ".STKX";

    fs.writeFile(filepath, generatePartFile(parts, filename), (err) => {
      if (err) throw err;
      console.log("The file was succesfully saved!");
    });

    res.send({ ok: true });
  });
});

const constructorInnerName = (inners) => {
  console.log();

  if (inners.name && inners.name.split("_").length === 3) {
    return {
      TOOLSNAME: inners.name.split("_")[0],
      TOOLSNUMBER: inners.name.split("_")[1],
      TOOLSFIX: inners.name.split("_")[2],
    };
  } else {
    return {
      TOOLSNAME: "MARICO",
      TOOLSNUMBER: "0",
      TOOLSFIX: "0",
    };
  }
};

app.get("/testimagen", async (req, res) => {
  res.send({ ok: true });
})

app.post("/testimagen", async (req, res) => {
  try {
    let sampleFile;
    let uploadPath;

    sampleFile = req.files.sampleFile;

    uploadPath = `./public/uploads/coohom.json`;

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    sampleFile.mv(uploadPath, async (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }

      let rawdata = fs.readFileSync(uploadPath);

      let filename = "ardis";

      let jsonCabinets = JSON.parse(rawdata);

      const cabinets = jsonCabinets.bomPlanks;

      let parts = "";
      let sequence = 0;

      cabinets.forEach((jsonNode) => {
        sequence = sequence + 1;
        parts = parts + String(GenerateArdisXML(jsonNode, sequence));
      });

      var filepath = "./public/" + filename + ".STKX";

      fs.writeFile(filepath, generatePartFile(parts, filename), (err) => {
        if (err) throw err;
        console.log("The file was succesfully saved!");
      });

      res.send({ ok: true });
    });
  } catch (error) {
    console.log(error);
  }
});
function encontrarEsquinas(points) {
  // Inicializar las variables para cada esquina con el primer punto
  let arribaIzquierda = { x: points[0], y: points[1] };
  let arribaDerecha = { x: points[0], y: points[1] };
  let abajoIzquierda = { x: points[0], y: points[1] };
  let abajoDerecha = { x: points[0], y: points[1] };
  // Iterar sobre los puntos
  for (let i = 2; i < points.length; i += 2) {
      let x = points[i];
      let y = points[i + 1];
      // Verificar esquina superior izquierda
      if (x <= arribaIzquierda.x && y >= arribaIzquierda.y) {
          arribaIzquierda = { x, y };
      }
      // Verificar esquina superior derecha
      if (x >= arribaDerecha.x && y >= arribaDerecha.y) {
          arribaDerecha = { x, y };
      }
      // Verificar esquina inferior izquierda
      if (x <= abajoIzquierda.x && y <= abajoIzquierda.y) {
          abajoIzquierda = { x, y };
      }
      // Verificar esquina inferior derecha
      if (x >= abajoDerecha.x && y <= abajoDerecha.y) {
          abajoDerecha = { x, y };
      }
  }
  // Devolver las esquinas
  return { arribaIzquierda, arribaDerecha, abajoIzquierda, abajoDerecha };
}
function orientacionRectangulo(esquinas) {
  // Calcular el ancho (diferencia en x entre las esquinas superior derecha e izquierda)
  let ancho = Math.abs(esquinas.arribaDerecha.x - esquinas.arribaIzquierda.x);
  // Calcular el alto (diferencia en y entre las esquinas superior izquierda e inferior izquierda)
  let alto = Math.abs(esquinas.arribaIzquierda.y - esquinas.abajoIzquierda.y);
  // Comparar ancho y alto para determinar la orientación
  if (ancho > alto) {
      return "horizontal";
  } else if (alto > ancho) {
      return "vertical";
  } else {
      return "cuadrado";
  }
}

const GenerateArdisXML = (json, sequence) => {
  try {
    let X, Y;
    let lpx = parseFloat(json.finishedWidth);
    let lpy = parseFloat(json.finishedHeight);
    let lpz = parseFloat(json.thickness);
    let result = "";
    let face;
    let identificador = 0;
    if (json.holes) {
      json.holes.forEach((el) => {
        identificador = identificador + 1;
        lpx = parseFloat(json.finishedWidth);
        lpy = parseFloat(json.finishedHeight);
        lpz = parseFloat(json.thickness);

        PartDrawLW = plankFace(el.plankFaceId).PartDrawLW;
        PartDrawSide = plankFace(el.plankFaceId).PartDrawSide;
        PartDrawQuadrant = plankFace(el.plankFaceId).PartDrawQuadrant;
        face = plankFace(el.plankFaceId).face;

        lpx = parseFloat(json.finishedWidth);
        lpy = parseFloat(json.finishedHeight);
        lpz = parseFloat(json.thickness);

        if (parseInt(el.plankFaceId) === 0 || parseInt(el.plankFaceId) === 5) {
          X = parseFloat(lpx / 2) + el.start.x;
          Y = parseFloat(lpy / 2) + el.start.y;
        } else if (
          parseInt(el.plankFaceId) === 2 ||
          parseInt(el.plankFaceId) === 4
        ) {
          X = parseFloat(lpx / 2) + el.start.x;
          Y = parseFloat(lpz / 2) + el.start.z;
        } else if (
          parseInt(el.plankFaceId) === 1 ||
          parseInt(el.plankFaceId) === 3
        ) {
          X = parseFloat(lpy / 2) + el.start.y;
          Y = parseFloat(lpz / 2) + el.start.z;
        }
        if(el.diameter/2>1){
        result =
          result +
          DrawDrillConverter({
            X:X.toFixed(3),
            Y:Y.toFixed(3),
            //RADIUS: parseFloat(el.diameter),
            RADIUS: parseFloat(el.diameter) / 2,
            WIDTH: lpy / 2 + el.end.y,
            THICK: el.width,
            Z2: el.depth,
            SIDE: plankFace(el.plankFaceId).PartDrawSide,
            QUADRANT: plankFace(el.plankFaceId).PartDrawQuadrant,
            FACE: face,
            ID:identificador,
            ORDER:""
          });
        }
      });
    }

    if (json.grooves) {
      let endX;
      let endY;
      let thick;
      json.grooves.forEach((el) => {
        if(el.profile){
          identificador = identificador + 1;
          lpx = parseFloat(json.finishedWidth);
          lpy = parseFloat(json.finishedHeight);
          lpz = parseFloat(json.thickness);
          let esquinas=encontrarEsquinas(el.profile.points);
          let orientación =orientacionRectangulo(esquinas);
          if(orientación=="horizontal"){
           thick= esquinas.arribaIzquierda.y-esquinas.abajoIzquierda.y;
           X=parseFloat((lpx/2)+esquinas.arribaIzquierda.x);
           endX=parseFloat((lpx/2)+esquinas.arribaDerecha.x);
           Y=parseFloat((lpy/2)+(esquinas.arribaIzquierda.y+esquinas.abajoIzquierda.y)/2);
           endY=parseFloat((lpy/2)+(esquinas.arribaDerecha.y+esquinas.abajoDerecha.y)/2);
           
          }else{
            //thick=esquinas.abajoIzquierda.x-esquinas.abajoDerecha.x;
          }
        }else if(el.start){
          identificador = identificador + 1;
          lpx = parseFloat(json.finishedWidth);
          lpy = parseFloat(json.finishedHeight);
          lpz = parseFloat(json.thickness);
          endX= (lpx/2)+el.end.x;
          endY=(lpy/2)+el.end.y;
          thick=el.width;
  
          if (parseInt(el.plankFaceId) === 0) {
            X = parseFloat(lpx / 2) + el.start.x;
            Y = parseFloat(lpy / 2) + el.start.y;
          } else {
            X = parseFloat(lpx / 2) + el.start.x;
            Y = parseFloat(lpy / 2) + el.start.y;
          }
         
        }else{
          console.log("no existe", el)
        }
        result =
        result +
        DrawLineConverter({
          FUNCTNAME: "LINE",
          X:X.toFixed(3),
          Y:Y.toFixed(3),
          LW: plankFace(el.plankFaceId).PartDrawLW,
          LENGTH: endX,
          WIDTH: endY,
          THICK: thick,
          Z2: el.depth,
          TOOLSNUMBER:`"${"MILL"}"`,
          SIDE: plankFace(el.plankFaceId).PartDrawSide,
          ID:identificador,
          ORDER:1
        });
  
      });
    }

    lpx = parseFloat(json.finishedWidth);
    lpy = parseFloat(json.finishedHeight);
    lpz = parseFloat(json.thickness);

    if (json.inners) {
      const inners = json.inners;

      for (let i = 0; i < inners.length; i++) {
        identificador = identificador + 1;

        let curves = inners[i].curves;
        let points = inners[i].points;
        let jx = {};

        let Pos = 0;

        //validemos si es solo  rectangulo
        for (let k = 0; k < curves.length; k++) {
          /// ARC ////////////////////////////////////////////////////////
          if (curves[k].type === "Arc") {
            jx = {};

            if (k < 1) {
              result =
                result +
                DrawArcConverter({
                  FUNCTNAME: "ARC",
                  X: lpx / 2 + points[Pos + 0],
                  Y: lpy / 2 + points[Pos + 1],
                  LW: "1",
                  SIDE: 0,
                  LENGTH: lpx / 2 + points[Pos + 2],
                  WIDTH: lpy / 2 + points[Pos + 3],
                  ID: identificador,
                  ORDER: k + 1,
                  RADIUS: CalcularRadio({
                    x1: lpx / 2 + points[Pos + 0],
                    y1: lpy / 2 + points[Pos + 1],
                    x2: lpx / 2 + points[Pos + 2],
                    y2: lpy / 2 + points[Pos + 3],
                    bulge: curves[k].bulge,
                  }).toFixed(3),
                  ...constructorInnerName(inners[i]),
                });
              Pos = 3;
            } else if (k === curves.length - 1) {
              if (
                String(points[Pos + 1]) !== "undefined" &&
                String(points[Pos + 2]) !== "undefined"
              ) {
                result =
                  result +
                  DrawArcConverter({
                    FUNCTNAME: "ARC",
                    X: lpx / 2 + points[Pos - 1],
                    Y: lpy / 2 + points[Pos],
                    LW: "1",
                    SIDE: 0,
                    LENGTH: lpx / 2 + points[0],
                    WIDTH: lpy / 2 + points[1],
                    ID: identificador,
                    ORDER: k + 1,
                    RADIUS: CalcularRadio({
                      x1: lpx / 2 + points[Pos - 1],
                      y1: lpy / 2 + points[Pos],
                      x2: lpx / 2 + points[0],
                      y2: lpy / 2 + points[1],
                      bulge: curves[k].bulge,
                    }).toFixed(3),
                    ...constructorInnerName(inners[i]),
                  });
              }
            } else {
              if (
                String(points[Pos + 1]) !== "undefined" &&
                String(points[Pos + 2]) !== "undefined"
              ) {
                result =
                  result +
                  DrawArcConverter({
                    FUNCTNAME: "ARC",
                    X: lpx / 2 + points[Pos - 1],
                    Y: lpy / 2 + points[Pos],
                    LW: "1",
                    SIDE: 0,
                    LENGTH: lpx / 2 + points[Pos + 1],
                    WIDTH: lpy / 2 + points[Pos + 2],
                    ID: identificador,
                    ORDER: k + 1,
                    RADIUS: CalcularRadio({
                      x1: lpx / 2 + points[Pos - 1],
                      y1: lpy / 2 + points[Pos],
                      x2: lpx / 2 + points[Pos + 1],
                      y2: lpy / 2 + points[Pos + 2],
                      bulge: curves[k].bulge,
                    }).toFixed(3),
                    ...constructorInnerName(inners[i]),
                  });
              }
            }

            if (k === curves.length - 1) {
              result =
                result +
                DrawArcConverter({
                  FUNCTNAME: "ARC",
                  X: lpx / 2 + points[Pos - 1],
                  Y: lpy / 2 + points[Pos],
                  LENGTH: lpx / 2 + points[0],
                  WIDTH: lpy / 2 + points[1],
                  SIDE: 0,
                  DIR: 1,
                  LW: 1,
                  ORDER: k + 1,
                  ID: identificador,
                  ORDER: k + 1,
                  RADIUS: CalcularRadio({
                    x1: lpx / 2 + points[Pos - 1],
                    y1: lpy / 2 + points[Pos],
                    x2: lpx / 2 + points[0],
                    y2: lpy / 2 + points[1],
                    bulge: curves[k].bulge,
                  }).toFixed(3),
                  ...constructorInnerName(inners[i]),
                });
            }
          }

          /// LINESEG ////////////////////////////////////////////////////////
          if (curves[k].type === "LineSeg") {
            jx = {
              FUNCTNAME: "LINE",
              X: lpx / 2 + points[k + 1],
              Y: lpy / 2 + points[k + 2],
              LENGTH: lpx / 2 + points[k + 3],
              WIDTH: lpy / 2 + points[k + 4],
            };

            if (k < 1) {
              result =
                result +
                DrawLineSegConverter({
                  FUNCTNAME: "LINE",
                  X: lpx / 2 + points[k + 0],
                  Y: lpy / 2 + points[k + 1],
                  LENGTH: lpx / 2 + points[k + 2],
                  WIDTH: lpy / 2 + points[k + 3],
                  SIDE: 0,
                  DIR: 1,
                  LW: 1,
                  ID: identificador,
                  ORDER: k + 1,
                  ...constructorInnerName(inners[i]),
                });

              Pos = 3;
            } else if (k === curves.length - 1) {
              if (
                String(points[Pos + 1]) !== "undefined" &&
                String(points[Pos + 2]) !== "undefined"
              ) {
                result =
                  result +
                  DrawLineSegConverter({
                    FUNCTNAME: "LINE",
                    X: lpx / 2 + points[Pos - 1],
                    Y: lpy / 2 + points[Pos],
                    LENGTH: lpx / 2 + points[0],
                    WIDTH: lpy / 2 + points[1],
                    SIDE: 0,
                    DIR: 1,
                    LW: 1,
                    ORDER: k + 1,
                    ID: identificador,
                    ...constructorInnerName(inners[i]),
                  });
              }
            } else {
              if (
                String(points[Pos + 1]) !== "undefined" &&
                String(points[Pos + 2]) !== "undefined"
              ) {
                result =
                  result +
                  DrawLineSegConverter({
                    FUNCTNAME: "LINE",
                    X: lpx / 2 + points[Pos - 1],
                    Y: lpy / 2 + points[Pos],
                    LENGTH: lpx / 2 + points[Pos + 1],
                    WIDTH: lpy / 2 + points[Pos + 2],
                    SIDE: 0,
                    DIR: 1,
                    LW: 1,
                    ORDER: k + 1,
                    ID: identificador,
                    ...constructorInnerName(inners[i]),
                  });
              }
            }

            if (k === curves.length - 1) {
              result =
                result +
                DrawLineSegConverter({
                  FUNCTNAME: "LINE",
                  X: lpx / 2 + points[Pos - 1],
                  Y: lpy / 2 + points[Pos],
                  LENGTH: lpx / 2 + points[0],
                  WIDTH: lpy / 2 + points[1],
                  SIDE: 0,
                  DIR: 1,
                  LW: 1,
                  ORDER: k + 1,
                  ID: identificador,
                  ...constructorInnerName(inners[i]),
                });
            }
          }

          ///////////////////////////////////////////////////////////
          if (k > 0) {
            Pos = Pos + 2;
          }
        }
      }
    }

    if (json.cuttingProfile) {
      const cuttingProfile = json.cuttingProfile;
      let curves = cuttingProfile.curves;
      let points = cuttingProfile.points;
      let Pos_cp = 0;

      //validemos si es solo  rectangulo
      identificador = identificador + 1;

      for (let k = 0; k < curves.length; k++) {
        /// ARC ////////////////////////////////////////////////////////

        if (curves[k].type === "Arc") {
          jx = {};

          /*if (k < 1) {
            result =
              result +
              DrawArcConverter({
                FUNCTNAME: "ARC",
                X: lpx / 2 + points[Pos_cp + 0],
                Y: lpy / 2 + points[Pos_cp + 1],
                LW: "1",
                SIDE: 0,
                LENGTH: lpx / 2 + points[Pos_cp + 2],
                WIDTH: lpy / 2 + points[Pos_cp + 3],
                ID: identificador,
                ORDER: k + 1,
                RADIUS: CalcularRadio({
                  x1: lpx / 2 + points[Pos_cp + 0],
                  y1: lpy / 2 + points[Pos_cp + 1],
                  x2: lpx / 2 + points[Pos_cp + 2],
                  y2: lpy / 2 + points[Pos_cp + 3],
                  bulge: curves[k].bulge,
                }).toFixed(3),
              });
            Pos_cp = 3;
          } else if (k === curves.length - 1) {
            if (
              String(points[Pos_cp + 1]) !== "undefined" &&
              String(points[Pos_cp + 2]) !== "undefined"
            ) {
              result =
                result +
                DrawArcConverter({
                  FUNCTNAME: "ARC",
                  X: lpx / 2 + points[Pos_cp - 1],
                  Y: lpy / 2 + points[Pos_cp],
                  LW: "1",
                  SIDE: 0,
                  LENGTH: lpx / 2 + points[0],
                  WIDTH: lpy / 2 + points[1],
                  ID: identificador,
                  ORDER: k + 1,
                  RADIUS: CalcularRadio({
                    x1: lpx / 2 + points[Pos_cp - 1],
                    y1: lpy / 2 + points[Pos_cp],
                    x2: lpx / 2 + points[0],
                    y2: lpy / 2 + points[1],
                    bulge: curves[k].bulge,
                  }).toFixed(3),
                });
            }
          }*/{
            if (
              String(points[Pos_cp + 1]) !== "undefined" &&
              String(points[Pos_cp + 2]) !== "undefined"
            ) {
              result =
                result +
                DrawArcConverter({
                  FUNCTNAME: "ARC",
                  X: lpx / 2 + points[Pos_cp +0],
                  Y: lpy / 2 + points[Pos_cp+1],
                  LW: "1",
                  SIDE: 0,
                  LENGTH: lpx / 2 + points[Pos_cp + 2],
                  WIDTH: lpy / 2 + points[Pos_cp + 3],
                  ID: identificador,
                  ORDER: k + 1,
                  TOOLSNUMBER:`"${"MILL"}"`,
                  TOOLSNAME:"",
                  LPZ:lpz,
                  RADIUS: CalcularRadio({
                    x1: lpx / 2 + points[Pos_cp+0],
                    y1: lpy / 2 + points[Pos_cp+1],
                    x2: lpx / 2 + points[Pos_cp + 2],
                    y2: lpy / 2 + points[Pos_cp + 3],
                    bulge: curves[k].bulge,
                  }).toFixed(3),
                });
            }
          }

          /*if (k === curves.length - 1) {
            result =
              result +
              DrawArcConverter({
                FUNCTNAME: "ARC",
                X: lpx / 2 + points[Pos_cp - 1],
                Y: lpy / 2 + points[Pos_cp],
                LENGTH: lpx / 2 + points[0],
                WIDTH: lpy / 2 + points[1],
                SIDE: 0,
                DIR: 1,
                LW: 1,
                ORDER: k + 1,
                ID: identificador,
                ORDER: k + 1,
                RADIUS: CalcularRadio({
                  x1: lpx / 2 + points[Pos_cp - 1],
                  y1: lpy / 2 + points[Pos_cp],
                  x2: lpx / 2 + points[0],
                  y2: lpy / 2 + points[1],
                  bulge: curves[k].bulge,
                }).toFixed(3),
              });
          }*/
        }

        /// LINESEG ////////////////////////////////////////////////////////
        if (curves[k].type === "LineSeg") {
          
          jx = {
            FUNCTNAME: "LINE",
            X: lpx / 2 + points[k + 1],
            Y: lpy / 2 + points[k + 2],
            LENGTH: lpx / 2 + points[k + 3],
            WIDTH: lpy / 2 + points[k + 4],
            ORDER: k + 1,
            ID: identificador,
          };
         
         /* if (k < 1) {
            result =
              result +
              DrawLineSegConverter({
                FUNCTNAME: "LINE",
                X: lpx / 2 + points[k + 0],
                Y: lpy / 2 + points[k + 1],
                LENGTH: lpx / 2 + points[k + 2],
                WIDTH: lpy / 2 + points[k + 3],
                SIDE: 0,
                DIR: 1,
                LW: 1,
                ID: identificador,
                ORDER: k + 1,
              });

            Pos_cp = 3;
          } else if (k === curves.length - 1) {
            console.log("dentro");
            console.log(curves.length);
            if (
              String(points[Pos_cp + 1]) !== "undefined" &&
              String(points[Pos_cp + 2]) !== "undefined"
            ) {
              result =
                result +
                DrawLineSegConverter({
                  FUNCTNAME: "LINE",
                  X: lpx / 2 + points[Pos_cp - 1],
                  Y: lpy / 2 + points[Pos_cp],
                  LENGTH: lpx / 2 + points[0],
                  WIDTH: lpy / 2 + points[1],
                  SIDE: 0,
                  DIR: 1,
                  LW: 1,
                  ORDER: k + 1,
                  ID: identificador,
                });
            }
          } else {*/
          
            if (
              String(points[Pos_cp + 1]) !== "undefined" &&
              String(points[Pos_cp + 2]) !== "undefined" &&
              lpx/2!==Math.abs(points[Pos_cp]) &&
              lpy/2!==Math.abs(points[Pos_cp+1]) ||
              lpx/2!==Math.abs(points[Pos_cp+2]) &&
              lpy/2!==Math.abs(points[Pos_cp+3])
              /*lpx/2-json.edgeBanding[0]!==Math.abs(points[Pos_cp]) || lpx/2-json.edgeBanding[2]!==Math.abs(points[Pos_cp])&&
              lpy/2-json.edgeBanding[1]!==Math.abs(points[Pos_cp+1]) || lpy/2-json.edgeBanding[3]!==Math.abs(points[Pos_cp+1])||
              lpx/2-json.edgeBanding[0]!==Math.abs(points[Pos_cp+2]) ||lpx/2-json.edgeBanding[2]!==Math.abs(points[Pos_cp+2]) &&
              lpy/2-json.edgeBanding[1]!==Math.abs(points[Pos_cp+3]) || lpy/2-json.edgeBanding[3]!==Math.abs(points[Pos_cp+3])*/
              
            ) {
             
              result =
                result +
                DrawLineSegConverter({
                  FUNCTNAME: "LINE",
                  LPZ:lpz,
                  X: lpx / 2 + points[Pos_cp+0],
                  Y: lpy / 2 + points[Pos_cp+1],
                  LENGTH: lpx / 2 + points[Pos_cp+2 ],
                  WIDTH: lpy / 2 + points[Pos_cp +3],
                  SIDE: 0,
                  DIR: 1,
                  LW: 1,
                  TOOLSNUMBER:`"${"MILL"}"`,
                  TOOLSNAME:"",
                  ORDER:"",
                  ID: identificador,
                });
            }
          //}

          /*if (k === curves.length - 1) {
            result =
              result +
              DrawLineSegConverter({
                FUNCTNAME: "LINE",
                X: lpx / 2 + points[Pos_cp - 1],
                Y: lpy / 2 + points[Pos_cp],
                LENGTH: lpx / 2 + points[0],
                WIDTH: lpy / 2 + points[1],
                SIDE: 0,
                DIR: 1,
                LW: 1,
                ORDER: k + 1,
                ID: identificador,
              });
          }*/
        }

        ///////////////////////////////////////////////////////////

        if (k<curves.length-2) {
          Pos_cp = Pos_cp + 2;
        }
      }
    }

    let endXML = generatePartList(json, String(result), sequence, face);

    return String(endXML);
  } catch (error) {
    console.log(error);
  } finally {
  }
};

const generatePartList = (data, partDraw, sequence, face) => {
  let edgeBanding = "";

  if (data.fourEdgesBanding && data.fourEdgesBanding.length > 0) {
    edgeBanding = `<PartEdge1>${data.fourEdgesBanding[1]}</PartEdge1>
  <PartEdge2>${data.fourEdgesBanding[3]}</PartEdge2>
  <PartEdge3>${data.fourEdgesBanding[0]}</PartEdge3>
  <PartEdge4>${data.fourEdgesBanding[2]}</PartEdge4>`;
  }

  return `<Part Key="${sequence}">
			<PartMat>${data.material}</PartMat>
			<PartD>1</PartD>
      <PartRemark>${data.name}</PartRemark>
      <PartRemark2>${data.productName}</PartRemark2>
			<PartL>${data.finishedWidth}</PartL>
			<PartW>${data.finishedHeight}</PartW>
			<PartQty>1</PartQty>${edgeBanding}
      <PartDraw>${partDraw}</PartDraw>
			<LPX>${data.finishedWidth}</LPX>
			<LPY>${data.finishedHeight}</LPY>
			<LPZ>${data.thickness}</LPZ>
		</Part>`;
};

const generatePartFile = (partList, filename) => {
  return `<?xml version="1.0" encoding="utf-8"?>
<PartFile ID="${filename}" Version="6.3.29" format="1.1.1">
	<PartList>
	${partList}
	</PartList>
	<VariableList>
	</VariableList>
	<PartFileProperties>
		<PartFName>${filename}</PartFName>
		<PartFCX>3000</PartFCX>
		<PartFCY>2000</PartFCY>
		<PartFCZ>100</PartFCZ>
	</PartFileProperties>
</PartFile>`;
};

const plankFace = (value) => {
  if (parseInt(value) === 0) {
    return {
      PartDrawLW: "1",
      PartDrawSide: "0",
      PartDrawQuadrant: "1",
      face: value,
    };
  } else if (parseInt(value) === 3) {
    return {
      PartDrawLW: "1",
      PartDrawSide: "2",
      PartDrawQuadrant: "4",
      face: value,
    };
  } else if (parseInt(value) === 1) {
    return {
      PartDrawLW: "1",
      PartDrawSide: "4",
      PartDrawQuadrant: "3",
      face: value,
    };
  } else if (parseInt(value) === 2) {
    return {
      PartDrawLW: "1",
      PartDrawSide: "1",
      PartDrawQuadrant: "3",
      face: value,
    };
  } else if (parseInt(value) === 4) {
    return {
      PartDrawLW: "1",
      PartDrawSide: "3",
      PartDrawQuadrant: "3",
      face: value,
    };
  } else if (parseInt(value) === 5) {
    return {
      PartDrawLW: "1",
      PartDrawSide: "5",
      PartDrawQuadrant: "1",
      face: value,
    };
  } else {
    return {
      PartDrawLW: "---",
      PartDrawSide: "---",
      PartDrawQuadrant: "---",
      face: value,
    };
  }
};

const SideFormat = (value) => {
  if (value == 0 || value == "---") return "";
  return `<SIDE>${value}</SIDE>`;
};

const DrawLineConverter = (data) => {
  return `<Draw><FUNCTNAME>LINE</FUNCTNAME><X>${data.X}</X><Y>${
    data.Y
  }</Y><LW>${data.LW}</LW><LENGTH>${data.LENGTH}</LENGTH><WIDTH>${
    data.WIDTH
  }</WIDTH><PartDrawTool>${
    data.TOOLSNUMBER
  }</PartDrawTool><PartDrawOpSide>${2}</PartDrawOpSide><THICK>${data.THICK}</THICK><Z2>${data.Z2}</Z2>${SideFormat(
    data.SIDE
  )}<PartDrawID>${data.ID}</PartDrawID><PartDrawSeq>${data.ORDER}</PartDrawSeq><PartDrawQuadrant>${data.SIDE==4?2:data.SIDE==2?1:data.SIDE==5?2:data.SIDE==0?1:""}</PartDrawQuadrant>
  </Draw>`;
};

const DrawLineSegConverter = (data) => {
  return `<Draw><FUNCTNAME>LINE</FUNCTNAME><X>${data.X}</X><Y>${
    data.Y
  }</Y><PartDrawSeq>${data.ORDER}</PartDrawSeq><PartDrawID>${
    data.ID
  }</PartDrawID><PartDrawExt01>${data.TOOLSNAME}</PartDrawExt01><PartDrawTool>${
    data.TOOLSNUMBER
  }</PartDrawTool><PartDrawOpSide>${data.TOOLSFIX}</PartDrawOpSide><LW>${
    data.LW
  }</LW><LENGTH>${data.LENGTH}</LENGTH><WIDTH>${data.WIDTH}</WIDTH>${SideFormat(
    data.SIDE
  )}<PartDrawZ2>${data.LPZ}</PartDrawZ2><PartDrawQuadrant>${data.SIDE==4?2:data.SIDE==2?1:data.SIDE==5?2:data.SIDE==0?1:""}</PartDrawQuadrant></Draw>`;
};

const DrawDrillConverter = (data) => {
  return `<Draw><FUNCTNAME>DRILL</FUNCTNAME><X>${data.X}</X><Y>${
    data.Y
  }</Y><RADIUS>${data.RADIUS}</RADIUS><Z2>${data.Z2}</Z2><QUADRANT>${
    data.QUADRANT
  }<PartDrawID>${data.ID}</PartDrawID> </QUADRANT><PartDrawSide>${data.SIDE}</PartDrawSide>
  <PartDrawQuadrant>${data.SIDE==4?2:data.SIDE==2?1:data.SIDE==5?2:data.SIDE==0?1:""}</PartDrawQuadrant></Draw>`;
};

const DrawArcConverter = (data) => {
  return `<Draw><FUNCTNAME>ARC</FUNCTNAME><X>${data.X}</X><Y>${data.Y}</Y><LW>${
    data.LW
  }</LW><PartDrawSeq>${data.ORDER}</PartDrawSeq><PartDrawID>${
    data.ID
  }</PartDrawID><PartDrawExt01>${data.TOOLSNAME}</PartDrawExt01><PartDrawTool>${
    data.TOOLSNUMBER
  }</PartDrawTool><PartDrawOpSide>${data.TOOLSFIX}</PartDrawOpSide><RADIUS>${
    data.RADIUS
  }</RADIUS><LENGTH>${data.LENGTH}</LENGTH><WIDTH>${data.WIDTH}</WIDTH><DIR>${
    data.RADIUS > 0 ? 1 : 2
  }</DIR>${SideFormat(data.SIDE)}<PartDrawZ2>${data.LPZ}</PartDrawZ2></Draw>`;
};

const CalcularRadio = ({ x1, y1, x2, y2, bulge }) => {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return (Math.sqrt(dx * dx + dy * dy) * (bulge * bulge + 1)) / (4 * bulge);
};

module.exports = app;
