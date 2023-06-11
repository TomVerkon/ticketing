export const consoleLog = (...args: any[]) => {
  console.log(new Date().toISOString(), ...args)
}
