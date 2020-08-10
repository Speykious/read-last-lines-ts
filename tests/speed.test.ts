import { readLastLines as rll } from "../lib/index"
import { read as rllo } from "read-last-lines"
import { resolve } from "path"
import { dim, bold, rgb24 } from "ansi-colors-ts"

const utf8_txt = resolve(__dirname, "./utf8.txt")
const dump_txt = resolve(__dirname, "./dump.txt")
const samples = 100
const orange = rgb24(0xffaa64)
const lightb = rgb24(0x64aaff)


test(`Speed difference on ${samples} loop samples | small file`, async () => {
	const start_rll = new Date()
	for (let i = 0; i < samples; i++)
		await rllo(utf8_txt, 10)
	const rll_ms = new Date().getTime() - start_rll.getTime()

	const start_rllts = new Date()
	for (let i = 0; i < samples; i++)
		rll(utf8_txt, 10)
	const rllts_ms = new Date().getTime() - start_rllts.getTime()

	expect(rllts_ms * 5).toBeLessThan(rll_ms)
																													// Nested interpolation <_<
console.log(`Time taken    (${orange("read-last-lines")}): ${orange(`${rll_ms} ms`)}
Time taken (${lightb("read-last-lines-ts")}): ${lightb(`${rllts_ms} ms`)}
rllts has performed ${bold(String(rll_ms / rllts_ms))} times faster than rll ${dim("(small file, all lines)")}`)
})

test(`Speed difference on ${samples} loop samples | big file`, async () => {
	const start_rll = new Date()
	for (let i = 0; i < samples; i++)
		await rllo(dump_txt, 10)
	const rll_ms = new Date().getTime() - start_rll.getTime()

	const start_rllts = new Date()
	for (let i = 0; i < samples; i++)
		rll(dump_txt, 10)
	const rllts_ms = new Date().getTime() - start_rllts.getTime()

	expect(rllts_ms * 3).toBeLessThan(rll_ms)

console.log(`Time taken    (${orange("read-last-lines")}): ${orange(`${rll_ms} ms`)}
Time taken (${lightb("read-last-lines-ts")}): ${lightb(`${rllts_ms} ms`)}
rllts has performed ${bold(String(rll_ms / rllts_ms))} times faster than rll ${dim("(big file, few lines)")}`)
})

test(`Speed difference on ${samples / 10} loop big samples | big file`, async () => {
	const start_rll = new Date()
	for (let i = 0; i < samples / 10; i++)
		await rllo(dump_txt, 300)
	const rll_ms = new Date().getTime() - start_rll.getTime()

	const start_rllts = new Date()
	for (let i = 0; i < samples / 10; i++)
		rll(dump_txt, 300)
	const rllts_ms = new Date().getTime() - start_rllts.getTime()

	expect(rllts_ms * 3).toBeLessThan(rll_ms)

console.log(`Time taken    (${orange("read-last-lines")}): ${orange(`${rll_ms} ms`)}
Time taken (${lightb("read-last-lines-ts")}): ${lightb(`${rllts_ms} ms`)}
rllts has performed ${bold(String(rll_ms / rllts_ms))} times faster than rll ${dim("(big file, all lines)")}`)
})