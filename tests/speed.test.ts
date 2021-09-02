import { readLastLines as rll } from "../lib/index"
import { read as rllo } from "read-last-lines"
import { resolve } from "path"
import { dim, bold, rgb24 } from "ansi-colors-ts"
import { expect } from "chai"

// Using absolute paths because the read-last-lines
// package doesn't handle relative paths the same way
// Also, it proves that rll interprets absolute paths correctly
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
	for (let i = 0; i < samples * 1000; i++)
		rll(file, lines)
	const rllts_ms = (new Date().getTime() - start_rllts.getTime()) / 1000

	expect(rllts_ms * 100).to.be.lessThan(rll_ms)
  // Nested interpolation <_<
  console.log(`
        Time taken    (${orange("read-last-lines")}): ${orange(`${rll_ms} ms`)}
        Time taken (${lightb("read-last-lines-ts")}): ${lightb(`${rllts_ms} ms`)}
        rllts has performed ${bold((rll_ms / rllts_ms).toFixed(2))} times faster than rll ${dim(`(${detail})`)}
  `)
}


describe("It is at least 100 times faster than read-last-lines", () => {
  it("Speed difference | small file", () =>
    abstract("small file, all lines", utf8_txt, 100, 10))

  it("Speed difference | medium file, few lines",
    () => abstract("medium file, few lines", dump_txt, 100, 10)
  ).timeout(10000)
  it("Speed difference | medium file, all lines",
    () => abstract("medium file, all lines", dump_txt, 10, 300)
  ).timeout(10000)

  it("Speed difference | large file, few lines",
    () => abstract("large file, few lines", bible_txt, 100, 10)
  ).timeout(10000)
  it("Speed difference | large file, lots of lines",
    () => abstract("large file, lots of lines", bible_txt, 10, 300)
  ).timeout(10000)
  it("Speed difference | large file, lots of lines",
    () => abstract("large file, LOTS of lines", bible_txt, 1, 3000)
  ).timeout(10000)
})
