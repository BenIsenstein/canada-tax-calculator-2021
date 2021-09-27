const validatePass = (password) => (
  /.{6,}$/.test(password) &&
  /[A-Z]+/.test(password) &&
  /[a-z]+/.test(password) &&
  /[0-9]+/.test(password)
)

const validatePassWithMessage = (value) => ( 
  validatePass(value) || 
  "The password must contain an uppercase letter, a lowercase letter, a number, and be at least 6 characters long." 
)

export { validatePass, validatePassWithMessage }