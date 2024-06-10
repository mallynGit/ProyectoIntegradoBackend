import { model } from "../models/reporte.js";
import { model as petmodel } from "../models/pet.js";
import { model as postmodel } from "../models/post.js";
import { model as commentmodel } from "../models/comentario.js";
import { model as usermodel } from "../models/user.js";
import { decodeToken } from "../utils/authToken.js";

export const createReport = async (req, res) => {
  const { contenido, reportedId, tipo } = req.body;

  try {
    const decoded = decodeToken(req.headers.authorization.slice(7));
    const reportante = decoded._id;

    const report = await model.create({
      reportante,
      contenido,
      reportedId,
      tipo,
    });

    res.json(report);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
};

export const getAll = async (req, res) => {
  try {
    const reports = await model
      .find({})
      .populate({ path: "reportante", select: "nick _id" });

    const promises = reports.map(async (report) => {
      let r = report.toObject();

      switch (report.tipo) {
        case "Comentario":
          const comment = await commentmodel.findById(report.reportedId);

          if (comment) {
            const posts = await postmodel.find({});
            const postParent = posts.find((post) =>
              post.comentarios.includes(comment._id)
            );

            const pets = await petmodel.find({});
            const petParent = pets.find((pet) =>
              pet.comentarios.includes(comment._id)
            );

            let parent = null;
            if (postParent && petParent) {
              parent = {
                type: "post",
                postid: postParent._id,
                petid: petParent._id,
              };
            } else if (postParent) {
              parent = {
                type: "post",
                postid: postParent._id,
              };
            } else if (petParent) {
              parent = {
                type: "pets",
                petid: petParent._id,
              };
            }

            r.item = JSON.parse(JSON.stringify(comment));
            r.item.parent = parent;
          }
          break;

        case "Post":
          const post = await postmodel.findById(report.reportedId);
          if (post) {
            const foundPets = await petmodel.find({});
            const filteredPet = foundPets.find((pet) =>
              pet.posts.includes(post._id)
            );

            r.item = {
              post: post._id,
              pet: filteredPet ? filteredPet._id : null,
            };
          } else {
            r.item = {
              post: null,
              pet: null,
            };
          }
          break;

        case "Pet":
          const pet = await petmodel.findById(report.reportedId);
          r.item = pet ? pet._id : null;
          break;
        default:
          // Handle default case if needed
          r.item = null;
          break;
      }

      return r;
    });

    const revisado = await Promise.all(promises);
    res.json(revisado);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Error al obtener los reports");
  }
};



export const deleteReport = async (req, res) => {
  const { id } = req.query;

  model
    .findByIdAndDelete({ _id: id })
    .then((deleted) => {
      if (deleted == null) {
        return res.status(404).send({ error: "Report not found" });
      }
      res.json(deleted);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ error: "Error deleting report" });
    });
};

export const checkResuelto = async (req, res) => {
  const { id } = req.query;
  console.log(id, 'vale?')
  const report = await model.findById(id);
  report.resuelto = !report.resuelto;
  await report.save();
  res.json(report.resuelto);
};