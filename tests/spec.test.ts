import { readLastLinesEnc as rlle, readLastLines as rll } from "../lib/index"
import { resolve } from "path"

const utf8_txt               = resolve(__dirname, "./utf8.txt")
const numbered_txt           = resolve(__dirname, "./numbered.txt")
const numbered_ntnl_txt      = resolve(__dirname, "./numbered-ntnl.txt")
const i_dont_exist_sorry_lol = resolve(__dirname, "./i-dont-exist-sorry-lol")

test("Get all lines when asked for more than the file has", () => {
	const allLines = rlle("utf8")(numbered_txt, 20)
	expect(allLines.split(/\n/).length).toBe(10 + 1)
})

test("Get last line when asked for 1", () => {
	const lastLine = rlle("utf8")(numbered_txt, 1)
	expect(lastLine.split(/\n/).length).toBe(1 + 1)
	expect(lastLine.trim().length).toBe(3)
})

test("Get last line when asked for 2", () => {
	const lastLine = rlle("utf8")(numbered_txt, 2)
	expect(lastLine.split(/\n/).length).toBe(2 + 1)
	expect(lastLine.trim().length).toBe(2 * 3 + 1)
})

test("Get last line when asked for 2 (no trailing newline)", () => {
	const lastLine = rlle("utf8")(numbered_ntnl_txt, 2)
	expect(lastLine.split(/\n/).length).toBe(2)
	expect(lastLine.trim().length).toBe(2 * 3 + 1)
})

test("File's existential crisis", () => {
	try {
		rll(i_dont_exist_sorry_lol, 1)
	} catch (err) {
		expect(err).toEqual(new Error(`File '${i_dont_exist_sorry_lol}' doesn't exist :(`))
	}
})

test("Reading UTF8 files", () => {
	const lines = rlle("utf8")(utf8_txt, 2)
	expect(lines).toMatch("english")
	expect(lines).toMatch("中文")
	expect(lines).toMatch("español")
	expect(lines).toMatch("português")
	expect(lines).toMatch("français")
	expect(lines).toMatch("日本語")
})