import { readLastLinesEnc as rlle, readLastLines as rll } from "../lib"

test("Get all lines when asked for more than the file has", () => {
	const allLines = rlle("utf8")("tests/numbered.txt", 20)
	expect(allLines.split(/\n/).length).toBe(10 + 1)
})

test("Get last line when asked for 1", () => {
	const lastLine = rlle("utf8")("tests/numbered.txt", 1)
	expect(lastLine.split(/\n/).length).toBe(1 + 1)
	expect(lastLine.trim().length).toBe(3)
})

test("Get last line when asked for 2", () => {
	const lastLine = rlle("utf8")("tests/numbered.txt", 2)
	expect(lastLine.split(/\n/).length).toBe(2 + 1)
	expect(lastLine.trim().length).toBe(2 * 3 + 1)
})

test("Get last line when asked for 2 (no trailing newline)", () => {
	const lastLine = rlle("utf8")("tests/numbered-ntnl.txt", 2)
	expect(lastLine.split(/\n/).length).toBe(2)
	expect(lastLine.trim().length).toBe(2 * 3 + 1)
})

test("File's existential crisis", () => {
	expect(rll("tests/i-dont-exist-sorry-lol", 1))
	.toThrowError("File 'tests/i-dont-exist-sorry-lol' doesn't exist :(")
})

test("Reading UTF8 files", () => {
	const lines = rlle("utf8")("tests/utf8.txt", 2)
	expect(lines).toMatch("english")
	expect(lines).toMatch("中文")
	expect(lines).toMatch("español")
	expect(lines).toMatch("português")
	expect(lines).toMatch("français")
	expect(lines).toMatch("日本語")
})