import * as fs from "fs"
import { resolve } from "path"

/**
 * Gets the path to the directory of the caller on a given layer.
 * @param layer The layer where the caller is on the stack.
 * @returns The directory path of the deduced caller.
 */
function getCallerDirPath(layer: number) {
  const stack = new Error().stack.split('\n')
  //console.log(stack)
  const stackl = stack[layer + 2]
  return stackl.slice(
    stackl.indexOf('/'),
    stackl.lastIndexOf('/') + 1
  )
}

/**
 * Handles the absolute/relative path.
 * @param layer The layer of stack call to pick from.
 * @param path The absolute/relative path to handle.
 * @returns The path relative to the specified layer.
 */
function handlePath(layer: number, path: string) {
  // Handling absolute paths
  if (path.length && path[0] === "/")
    return path
  // The '+ 1' is here to make the layer relative to the
  // handlePath call and not the getCallerDirPath call
  const gcdp = getCallerDirPath(layer + 1)
  //console.log("handlePath returns with path:", gcdp)
  return resolve(gcdp, path)
}


// This function is now useless
// /**
//  * Reads the previous character of a file, if the
//  * function's name doesn't already explain enough.
//  * @param fd The file descriptor to read from.
//  * @param stats The stats of the file which are needed.
//  * @param ccc The current char count to know which char to read (a.k.a the reverse index).
//  * @returns The read previous character.
//  */
// function readPreviousChar(fd: number, stats: fs.Stats, ccc: number) {
//   const buffer = Buffer.alloc(1)
//   fs.readSync(fd, buffer, 0, 1, stats.size - 1 - ccc)
//   return buffer.toString()
// }

/**
 * Reads the previous character of a file, if the
 * function's name doesn't already explain enough.
 * @param fd The file descriptor to read from.
 * @param fileSize The size of the file.
 * @param ccc The current char count to know which char to read (a.k.a the reverse index).
 * @param n The maximum number of characters to read.
 * @returns The read previous character.
 */
function readPreviousChars(fd: number, fileSize: number, ccc: number, buffer: Buffer): string {
  const n = buffer.length
  const ci = fileSize - ccc
  if (n <= ci) {
    fs.readSync(fd, buffer, 0, n, ci - n)
    return buffer.toString('binary')
  } else {
    fs.readSync(fd, buffer, 0, ci, 0)
    return buffer.slice(0, ci).toString('binary')
  }
}

/**
 * Reads the last lines of a file.
 * @param fp Absolute/relative path to the file.
 * @param nlines Number of maximum lines to read.
 * @param pathlayer The layer to consider when handling paths.
 * @param bufferLength The length of the character buffer.
 * @returns A buffer containing the lines that have been read.
 */
function __rll(fd: number, fileSize: number, nlines: number, bufferLength: number): Buffer {
  // Open the file before doing anything else
  // const fd = fs.openSync(fp, "r")
  // const fileSize = fs.statSync(fp).size
  const buffer = Buffer.alloc(bufferLength)

  let ichars = 0
  let ilines = 0
  let lines = ""

  // Read characters backwards until it's enough
  let reading = true
  while (true) {
    const pchars = readPreviousChars(fd, fileSize, ichars, buffer)
    if (pchars.length === 0) break

    for (let i = pchars.length - 1; i > 0; i--) {
      // Increment the line counter, unless it's a trailing line character
      if (pchars[i] === '\n' && (ichars > 0 || i < pchars.length - 1))
        ilines++

      // Take the rest of the characters when the maximum number of lines has been reached
      if (ilines >= nlines) {
        const pcharSlice = pchars.slice(i)
        lines = pcharSlice + lines
        ichars += pcharSlice.length
        reading = false
        break
      }
    }

    if (!reading) break
    ichars += pchars.length
    lines = pchars + lines
  }

  fs.closeSync(fd)

  // Do not include the first newline character when there is one
  if (lines[0] === "\n")
    lines = lines.slice(1)

  return Buffer.from(lines, "binary")
}

/**
 * Reads the last lines of a file.
 * @param fp Absolute/relative path to the file.
 * @param nlines Number of maximum lines to read.
 * @param bufferLength The length of the character buffer - 4096 by default.
 * @returns A buffer containing the lines that have been read.
 */
export function readLastLines(filePath: string, nlines: number, bufferLength: number = 4096): Buffer {
  const fp = handlePath(1, filePath)
  if (!fs.existsSync(fp))
    throw new Error(`File '${fp}' doesn't exist :(`)
  const fd = fs.openSync(fp, "r")
  const fileSize = fs.statSync(fp).size
  return __rll(fd, fileSize, nlines, bufferLength)
}

export async function readLastLinesFromHandle(fileHandle: fs.promises.FileHandle, nlines: number, bufferLength: number = 4096): Promise<Buffer> {
  const fd = fileHandle.fd
  const fileSize = (await fileHandle.stat()).size
  return __rll(fd, fileSize, nlines, bufferLength)
}

/**
 * Reads the last lines of a file and encodes them into a string.
 * @param encoding How you want to encode the string from the buffer.
 * @returns An encoded string containing the lines that have been read.
 */
export const readLastLinesEnc = (encoding: BufferEncoding) => (
  filePath: string, nlines: number, bufferLength: number = 4096
): string => {
  const fp = handlePath(1, filePath)
  return readLastLines(fp, nlines, bufferLength).toString(encoding)
}
