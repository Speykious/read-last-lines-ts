import { expect } from "chai"
import { readLastLinesEnc as rlle, readLastLines as rll, readLastLinesFromHandle as rllfh } from "../lib/index"
import { resolve } from "path"
import * as fs from "fs"

const rllu = rlle("utf8")

describe("It works", () => {
  it("Get all lines when asked for more than the file has", () => {
    const allLines = rllu("./numbered.txt", 20)
    expect(allLines.split(/\n/).length).to.equal(10 + 1)
  })

  it("Get last line when asked for 1", () => {
    const lastLine = rllu("./numbered.txt", 1)
    expect(lastLine.split(/\n/).length).to.equal(1 + 1)
    expect(lastLine.trim().length).to.equal(3)
  })

  it("Get last line when asked for 2", () => {
    const lastLine = rllu("./numbered.txt", 2)
    expect(lastLine.split(/\n/).length).to.equal(2 + 1)
    expect(lastLine.trim().length).to.equal(2 * 3 + 1)
  })

  it("Get last line when asked for 2 (no trailing newline)", () => {
    const lastLine = rllu("./numbered-ntnl.txt", 2)
    expect(lastLine.split(/\n/).length).to.equal(2)
    expect(lastLine.trim().length).to.equal(2 * 3 + 1)
  })

  it("File's existential crisis", () => {
    expect(() => {
      rll("./i-dont-exist-sorry-lol", 1)
    }).to.throw(`File '${resolve(__dirname, "./i-dont-exist-sorry-lol")}' doesn't exist :(`)
  })

  it("Reading UTF8 files", () => {
    const lines = rllu("./utf8.txt", 2)
    expect(lines).to.include("english")
    expect(lines).to.include("中文")
    expect(lines).to.include("español")
    expect(lines).to.include("português")
    expect(lines).to.include("français")
    expect(lines).to.include("日本語")
  })

  it("Reading the entire chinese bible for no reason", () => {
    const allLines = rllu("./chinese-bible.txt", 50000)
    expect(allLines.split(/\n/).length).to.equal(31032)
  })

  it("FileHandle version works the same way", async () => {
    const fileHandle = await fs.promises.open(resolve(__dirname, "./chinese-bible.txt"), 'r')
    const allLines = (await rllfh(fileHandle, 50000)).toString()
    expect(allLines.split(/\n/).length).to.equal(31032)
    await fileHandle.close()
  })
})
