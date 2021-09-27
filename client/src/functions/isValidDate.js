const isValidDate = (date) => (
  date && 
  Object.prototype.toString.call(date) === "[object Date]" && 
  !isNaN(date)
)

/* a bit on the function isValidDate --- from https://stackoverflow.com/questions/643782/how-to-check-whether-an-object-is-a-date/44198641#44198641
  
  " - date checks whether the parameter was not a falsy value (undefined, null, 0, "", etc..)

  - Object.prototype.toString.call(date) returns a native string representation of the given 
  object type - In our case "[object Date]". Because date.toString() overrides its parent method, 
  we need to .call or .apply the method from Object.prototype directly which .. Bypasses user-defined 
  object type with the same constructor name (e.g.: "Date")
  Works across different JS contexts (e.g. iframes) in contrast to instanceof or Date.prototype.isPrototypeOf.

  - !isNaN(date) finally checks whether the value was not an Invalid Date.""
*/


export { isValidDate }