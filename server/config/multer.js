const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function(req,file, cb){
        cb(null,'uploads');
    },
    filename: function(req,file, cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random()*1E9);
        cb(null, file.filename + '-' + uniqueSuffix + path.extname(file.originalname)) 
    }

})

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cd) {
        const filetypes = /pdf|doc|docx/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
        const mimetype = filetypes.test(file.mimetype)
        
        if( mimetype && extname){
            return cb(null, true)
        } else{
            cb('Error: Allow only .pdf, .doc, .docx files!')
        }
        
    },
    limits: {fileSize: 1024 * 1024 * 5}
})

module.exports = upload