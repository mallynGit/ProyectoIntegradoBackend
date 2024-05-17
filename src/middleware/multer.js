import multer from 'multer'
import path from 'path'

const __dirname = path.resolve() + '/src'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(req.query, file, 'query y file ?')
        cb(null, path.join(__dirname, '/uploads'))
    },
    filename: (req, file, cb) => {
        cb(null, (req.query.filename ? req.query.filename : crypto.randomUUID()) + path.extname(file.originalname))
    }
})

const fileFilter = (req, file, callback) => {
    const ext = path.extname(file.originalname)
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.webp') {
        return callback('Only images are allowed', false)
    }
    callback(null, true)
}

const upload = multer({ storage, fileFilter }).single('media')
const multi = multer({ storage, fileFilter }).array('multi')

export { multi }
export default upload