const express = require("express"); 

const cors = require("cors");

const multer = require("multer");

const jwt = require("jsonwebtoken");

const app = express(); 

const port = 3000;

const SECRET_KEY = "1234";

app.use(cors());

app.use(express.json()); 

const fs = require ('fs');

const storage = multer.diskStorage({
    destination: "./img",
    filename: function (req, file, cb) {
        const id = getNextPageId();
        cb(null, "imagen" + id+".jpg");
    },
});


const upload = multer({ storage: storage });

const PAGES = require("./api/pages.json");

const USUARIOS = require("./api/usuarios.json");

app.get("/pages", (req, res) => {
    
    res.json(PAGES);
});

function getNextPageId() {
    const maxId = PAGES.reduce((max, page) => (page.id > max ? page.id : max), 0);
    return maxId + 1;
}

app.post("/pages", (req, res) => {

    const newPage = {
        id: getNextPageId(), 
        image: `/img/imagen${getNextPageId()}.jpg`,
        description: req.body.description,
        content: req.body.content
    };

    PAGES.push(newPage);

    fs.writeFileSync("./api/pages.json", JSON.stringify(PAGES, null, 2));

    res.json(PAGES);
});


app.post("/upload", upload.single("image"), (req, res) => {
    res.json({ message: "Imagen subida exitosamente" });
});

app.get("/pages/:id", (req, res) => {
    const index = req.params.id - 1 
    const PAGE = require("./api/pages.json")
    res.json(PAGE[index])
})

app.post("/register", (req, res) => {
    const { username, password } = req.body;
    const id = getNextUserId();
  
    const newUser = {
      id,
      username,
      password,
    };
  
    USUARIOS.push(newUser);
  
    fs.writeFileSync("./api/usuarios.json", JSON.stringify(USUARIOS, null, 2));
  
    res.json({ message: "Usuario registrado exitosamente" });
  });
  
  
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = USUARIOS.find((u) => u.username === username && u.password === password);

  if (user) {
    
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY);
    res.json({ token });
  } else {
    res.status(401).json({ message: "Credenciales inválidas" });
  }
});
  
  function getNextUserId() {
    const maxId = USUARIOS.reduce((max, user) => (user.id > max ? user.id : max), 0);
    return maxId + 1;
  }

// Middleware para verificar token JWT
function authenticateToken(req, res, next) {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Acceso no autorizado" });
  
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json({ message: "Token inválido" });
      req.user = user;
      next();
    });
  }

// Rutas protegidas
app.get("/index.html", authenticateToken, (req, res) => {
    res.sendFile(__dirname + "/index.html");
  });
  
app.get("/pages.html", authenticateToken, (req, res) => {
  res.sendFile(__dirname + "/pages.html");
});
  
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });
  