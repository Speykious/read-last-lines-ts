import * as fs from "fs"

function readPreviousChar(fd: number, stats, ccc: number) {
	const buffer = Buffer.alloc(1)
	fs.readSync(fd, buffer, 0, 1, stats.size - 1 - ccc)
	return String.fromCharCode(buffer[0])
}

/**
 * Reads the last lines of a file.
 * @param filepath Absolute/Relative path to the file.
 * @param nlines Number of maximum lines to read.
 * @param encoding Character encoding to be used for the buffer.
 */
export async function readLastLines(filepath: string, nlines: number, encoding: BufferEncoding = "utf8") {

}