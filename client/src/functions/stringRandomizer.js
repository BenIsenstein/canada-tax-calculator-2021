const stringRandomizer = (length) => {

  let result = ""
  let charList = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  if ( !(length) || (length < 1)) length = 6

  for ( let index = 0; index < length; index++ ) {
      result += charList.charAt(Math.floor(Math.random() * charList.length))
  }
  
  return result
}
export default stringRandomizer