function getFile(fileUrl) {
    console.log(`Getting file content for url: ${fileUrl}`);
    return `content-of-${fileUrl}`;
}

module.exports = getFile;
