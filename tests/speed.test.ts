import { readLastLines as rll } from "../lib/index"
import { read as rllo } from "read-last-lines"
import { resolve } from "path"
import { dim, bold, rgb24 } from "ansi-colors-ts"
import { format } from "util"

// Using absolute paths because the read-last-lines
// package doesn't handle relative paths the same way
const utf8_txt = resolve(__dirname, "./utf8.txt")
const dump_txt = resolve(__dirname, "./dump.txt")
const bible_txt = resolve(__dirname, "./bible.txt")
const orange = rgb24(0xffaa64)
const lightb = rgb24(0x64aaff)

const abstract = async (detail: string, file: string, samples: number, lines: number) => {
	const start_rll = new Date()
	for (let i = 0; i < samples; i++)
		await rllo(file, lines)
	const rll_ms = new Date().getTime() - start_rll.getTime()

	const start_rllts = new Date()
	for (let i = 0; i < samples; i++)
		rll(file, lines)
	const rllts_ms = new Date().getTime() - start_rllts.getTime()

	expect(rllts_ms * 5).toBeLessThan(rll_ms)
																													// Nested interpolation <_<
console.log(`Time taken    (${orange("read-last-lines")}): ${orange(`${rll_ms} ms`)}
Time taken (${lightb("read-last-lines-ts")}): ${lightb(`${rllts_ms} ms`)}
rllts has performed ${bold((rll_ms / rllts_ms).toFixed(2))} times faster than rll ${dim(`(${detail})`)}`)
}


test(`Speed difference | small file`, () =>
	abstract("small file, all lines", utf8_txt, 100, 10))

test(`Speed difference | medium file, few lines`,
	() => abstract("medium file, few lines", dump_txt, 100, 10),
	10000)
test(`Speed difference | medium file, all lines`,
	() => abstract("medium file, all lines", dump_txt, 10, 300),
	10000)

test(`Speed difference | large file, few lines`,
	() => abstract("large file, few lines", bible_txt, 100, 10),
	10000)
test(`Speed difference | large file, lots of lines`,
	() => abstract("large file, lots of lines", bible_txt, 10, 300),
	10000)
