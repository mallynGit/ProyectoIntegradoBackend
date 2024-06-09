import multer from "multer";
import path from "path";

const __dirname = path.resolve() + "/src";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const randomId = crypto.randomUUID();
    if (file.originalname.split(".")[0].includes("test")) {
      file.originalname = randomId + path.extname(file.originalname);
      req.userimage = randomId;
      file.test = true;
    } else if (file.originalname.split(".")[0].includes("pet")) {
      console.log("hay :)");
      const randomId = crypto.randomUUID();
      req.pets = { ...req.pets, [file.originalname.split(".")[0]]: randomId };
      file.originalname = randomId + path.extname(file.originalname);
    } else if (file.originalname.split(".")[0].includes("update")) {
      file.update = crypto.randomUUID();
      console.log("BIEN!!!");
    }
    console.log(req.query, file, "query y file ?");
    cb(null, path.join(__dirname, "/uploads"));
  },
  filename: (req, file, cb) => {
    req.pets ? console.log("hay pets", req.pets) : null;
    file.test ? console.log("esta es especial") : null;
    if (!file.test && !req.pets) {
      cb(
        null,
        (req.query.filename ? req.query.filename : crypto.randomUUID()) +
          path.extname(file.originalname)
      );
    } else {
      const randomId = crypto.randomUUID();

      cb(null, randomId);
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
