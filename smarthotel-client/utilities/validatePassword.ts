const validatePassword = (password: string) => {
  const passwordValidator = require('password-validator')
  const SchemaClass = new passwordValidator()
  const Schema = SchemaClass.is()
    .min(6)
    .max(25)
    .has()
    .uppercase()
    .has()
    .lowercase()
    .has()
    .digits(1)
    .has()
    .not()
    .spaces()
  return Schema.validate(password)
}
export default validatePassword
