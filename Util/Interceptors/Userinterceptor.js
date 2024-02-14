import axios from 'axios'
import env from 'dotenv'
env.config()

axios.defaults.baseURL='BACKEND_URL'

const Tokenaxcess =localStorage.getItem('accesToken')

axios.defaults.headers.common['Authorization']=Tokenaxcess ?`Bearer ${Tokenaxcess}`:'';
axios.defaults.headers.post['Con'