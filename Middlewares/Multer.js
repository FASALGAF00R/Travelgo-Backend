import multer from 'multer'
const storage = multer.diskStorage({})
 export const upload = multer({storage})































//  Multer provides us with two storage options: disk and memory storage
// export const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'Uploads/'); 
//       },
//       filename: function (req, file, cb) {
//         cb(null,file.originalname)
//       }

// })