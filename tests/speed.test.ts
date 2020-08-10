import { readLastLinesEnc as rlle, readLastLines as rll } from "../lib/index"
import { read as rllo } from "read-last-lines"
import { resolve } from "path"

const utf8_txt = resolve(__dirname, "./utf8.txt")
const dump_txt = resolve(__dirname, "./dump.txt")
const samples = 100


test(`Speed difference on ${samples} loop samples | small file`, async () => {
	const start_rll = new Date()
	for (let i = 0; i < samples; i++)
		await rllo(utf8_txt, 10)
	const rll_ms = new Date().getTime() - start_rll.getTime()
	console.log(`Time taken    (read-last-lines):`, rll_ms, "ms")

	const start_rllts = new Date()
	for (let i = 0; i < samples; i++)
		rll(utf8_txt, 10)
	const rllts_ms = new Date().getTime() - start_rllts.getTime()
	console.log(`Time taken (read-last-lines-ts):`, rllts_ms, "ms")

	expect(rllts_ms * 5).toBeLessThan(rll_ms)
})

test("Speed difference on samples loop samples | big file", async () => {
	const start_rll = new Date()
	for (let i = 0; i < samples; i++)
		await rllo(dump_txt, 10)
	const rll_ms = new Date().getTime() - start_rll.getTime()
	console.log(`Time taken    (read-last-lines):`, rll_ms, "ms")

	const start_rllts = new Date()
	for (let i = 0; i < samples; i++)
		rll(dump_txt, 10)
	const rllts_ms = new Date().getTime() - start_rllts.getTime()
	console.log(`Time taken (read-last-lines-ts):`, rllts_ms, "ms")

	expect(rllts_ms * 3).toBeLessThan(rll_ms)
})