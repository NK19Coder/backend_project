import multer from "multer"; 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp') // Specify the destination folder for uploaded files, null signiface no error 
    }, 
    filename: function (req, file, cb) {
      cb(null, file.originalname) // Use the original file name for the uploaded file
    } 
  })
      
export const upload = multer({ 
    storage, 
})   

