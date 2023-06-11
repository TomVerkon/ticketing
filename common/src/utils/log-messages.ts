export const loggingMessages = () => {
  return process.env.LOG_MSGS === 'true' ? true : false
}
