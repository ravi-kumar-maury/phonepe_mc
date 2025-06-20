function createDiffPack(fromFile, toFile) {
    console.log(`Creating diff pack from ${fromFile} to ${toFile}`);
    return `diff-${fromFile}-to-${toFile}`;
}

module.exports = createDiffPack;
