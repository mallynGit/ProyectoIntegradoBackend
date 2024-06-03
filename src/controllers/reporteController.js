import { model } from '../models/reporte.js'
import { model as petmodel } from '../models/pet.js'
import { model as postmodel } from '../models/post.js'
import { model as commentmodel } from '../models/comentario.js'
import { model as usermodel } from '../models/user.js'
import { decodeToken } from '../utils/authToken.js'

export const createReport = async (req, res) => {

    const { contenido, reportedId, tipo } = req.body

    try {
        const decoded = decodeToken(req.headers.authorization.slice(7))
        const reportante = decoded._id

        const report = await model.create({ reportante, contenido, reportedId, tipo })

        res.json(report)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: err })
    }
}

export const getAll = async (req, res) => {
    try {
        const reports = await model.find({}).populate({ path: 'reportante', select: 'nick _id' });
        
        const promises = reports.map(report => {
            let r = report.toObject();
            return new Promise((resolve, reject) => {
                switch (report.tipo) {
                    case 'Comentario':
                        commentmodel.findById({ _id: report.reportedId }).then(comment => {
                            r.item = comment;
                            resolve(r);
                        }).catch(reject);
                        break;

                    case 'Post':
                        postmodel.findById({ _id: report.reportedId }).then(post => {
                            r.item = post;
                            resolve(r);
                        }).catch(reject);
                        break;

                    case 'Pet':
                        petmodel.findById({ _id: report.reportedId }).then(pet => {
                            r.item = pet;
                            resolve(r);
                        }).catch(reject);
                        break;

                    case 'Media':

                        resolve(r);
                        break;

                    default:
                        resolve(r);
                        break;
                }
            });
        });

        const revisado = await Promise.all(promises);
        res.json(revisado);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error al obtener los reports');
    }
};


export const deleteReport = async (req, res) => {

    const { id } = req.query

    model.findByIdAndDelete({ _id: id }).then((deleted) => {
        if (deleted == null) {
            return res.status(404).send({ error: 'Report not found' })
        }
        res.json(deleted)
    }).catch((err) => {
        console.log(err)
        return res.status(500).send({ error: 'Error deleting report' })
    })

}

