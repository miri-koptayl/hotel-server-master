import { appendFile } from "fs/promises";

export default async function logToFile(req, res, next) {

    await appendFile("./log.txt", `\n ${new Date().toLocaleDateString()} ${req.method}  `)
    next()

}