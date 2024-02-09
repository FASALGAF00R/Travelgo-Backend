import multer from 'multer'
console.log("hhhhhhhhhhhhhhhhhhhhhhh");
export const storage = multer.diskStorage({})
export const upload = multer({storage:storage});
console.log(upload,"uploafd");

//  Multer provides us with two storage options: disk and memory storage