import axios from 'axios';
export const server = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    "Content-Type":'application/json'
  },
});
export const request=({...options})=> {
  server.defaults.headers.common.Authorization= 'Bearer Token'
  const onSuccess= (Response)=> Response
  const onError=(error)=> {
    return error
  }
  return server(options.then(onSuccess).catch(onError))
}
