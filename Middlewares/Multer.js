import multer from 'multer'
export const storage = multer.diskStorage({})
export const upload = multer({storage:storage});

//  Multer provides us with two storage options: disk and memory storage