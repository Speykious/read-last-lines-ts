import { readLastLinesEnc as rlle, readLastLines as rll } from "../lib"
import { read as rllo } from "read-last-lines"

test("Speed difference on 1000 loop samples | small file", () => {
	const start_rll = new Date()
	for (let i = 0; i < 1000; i++)
		rllo("../tests/utf8.txt", 10)
	const rll_ms = new Date().getTime() - start_rll.getTime()
	console.log(`Time taken    (read-last-lines):`, rll_ms, "ms")

	const start_rllts = new Date()
	for (let i = 0; i < 1000; i++)
		rll("../tests/utf8.txt", 10)
	const rllts_ms = new Date().getTime() - start_rllts.getTime()
	console.log(`Time taken (read-last-lines-ts):`, rllts_ms, "ms")

	expect(rllts_ms * 3).toBeLessThan(rll_ms)
})

test("Speed difference on 1000 loop samples | big file", () => {
	const start_rll = new Date()
	for (let i = 0; i < 1000; i++)
		rllo("../tests/dump.txt", 10)
	const rll_ms = new Date().getTime() - start_rll.getTime()
	console.log(`Time taken    (read-last-lines):`, rll_ms, "ms")

	const start_rllts = new Date()
	for (let i = 0; i < 1000; i++)
		rll("../tests/dump.txt", 10)
	const rllts_ms = new Date().getTime() - start_rllts.getTime()
	console.log(`Time taken (read-last-lines-ts):`, rllts_ms, "ms")

	expect(rllts_ms * 3).toBeLessThan(rll_ms)
})