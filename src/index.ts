import * as fs from "fs"

function readPreviousChar(fd: number, stats: fs.Stats, ccc: number) {
	const buffer = Buffer.alloc(1)
	fs.readSync(fd, buffer, 0, 1, stats.size - 1 - ccc)
	return String.fromCharCode(buffer[0])
}

/**
 * Reads the last lines of a file.
 * @param filepath Absolute path to the file.
 * @param nlines Number of maximum lines to read.
 * @returns A buffer containing the lines that have been read.
 */
export function readLastLines(
	filepath: string,
	nlines: number
) {
	if (!fs.existsSync(filepath))
		throw new Error(`File '${filepath}' doesn't exist :(`)
	
	// Open the file before doing anything else
	const fd = fs.openSync(filepath, "r")
	const fstats = fs.statSync(filepath)
	
	let ichars = 0
	let ilines = 0
	let lines = ""

	// Read characters backwards until it's enough
	while (ichars < fstats.size && ilines < nlines) {
		const pchar = readPreviousChar(fd, fstats, ichars)
		lines = pchar + lines
		if (pchar === "\n" && ichars > 0) ilines++
		ichars++
	}

	fs.closeSync(fd)

	// Do not include the first newline character when there is one
	if (lines[0] === "\n")
		lines = lines.slice(1)

	return Buffer.from(lines, "binary")
}

/**
 * Reads the last lines of a file and encodes them into a string.
 * @param encoding How you want to encode the string from the buffer.
 * @returns An encoded string containing the lines that have been read.
 */
export const readLastLinesEnc = (encoding: BufferEncoding) => (
	filepath: string, nlines: number
) => readLastLines(filepath, nlines).toString(encoding)
