// import something here
import io from 'socket.io-client'

// "async" is optional
export default async ({
  Vue
}) => {
  // something to do
  Vue.prototype.$socket = await io('http://localhost.local:8081')
}
