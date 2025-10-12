let key = prompt("Enter key u want to set")
let value = prompt("Enter value u want to set")

localStorage.setItem(key,value)

console.log(`The value at ${key} is ${localStorage.getItem(key)}`)