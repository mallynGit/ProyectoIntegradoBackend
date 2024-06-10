import multer from "multer";
import path from "path";
import fs from 'fs';
import crypto from 'crypto';

const __dirname = path.resolve() + "/src";
const uploads = path.join(__dirname, "uploads");

// Función para eliminar el archivo antiguo
const deleteOldFile = (userId) => {
  const files = fs.readdirSync(uploads);
  const found = files.find((file) => file.split(".")[0] == userId);
  if (found) {
    fs.unlinkSync(path.join(uploads, found));
    return true;
  }
  return false;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.originalname.split(".")[0].includes("pet")) {
      console.log("hay :)");
      const randomId = crypto.randomUUID();
      req.pets = { ...req.pets, [file.originalname.split(".")[0]]: randomId };
      file.originalname = randomId + path.extname(file.originalname);
    } else if (file.originalname.split(".")[0].includes("update")) {
      if (req.body.updateUser == true) {
        let userId = req.body.userId;
        const isDeleted = deleteOldFile(userId);
        if (isDeleted) {
          file.originalname = userId + path.extname(file.originalname);
        } else {
          file.originalname = crypto.randomUUID() + path.extname(file.originalname);
        }
      } else {
        file.originalname = crypto.randomUUID() + path.extname(file.originalname);
      }
      console.log("BIEN!!!");
    }
    console.log(req.query, file, "query y file ?");
    cb(null, uploads);
  },
  filename: (req, file, cb) => {
    if (req.body.updateUser) {
      console.log('EXISTE EL PUTO FILE UPDATE');
      cb(null, req.body.userId + path.extname(file.originalname));
    } else {
      const randomId = crypto.randomUUID();
      cb(null, randomId + path.extname(file.originalname));
    }
  },
});

const fileFilter = (req, file, callback) => {
  console.log(file, "file");
  const ext = path.extname(file.originalname);
  if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".webp") {
    return callback("Only images are allowed", false);
  }
  callback(null, true);
};

const upload = multer({ storage, fileFilter }).single("media");
const multi = multer({ storage, fileFilter }).array("multi");

export { multi };
export default upload;
