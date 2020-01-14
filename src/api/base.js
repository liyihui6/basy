import axios from 'axios'
import host from './config'

var instance = axios.create({
    baseURL: host
  });

  export default instance;