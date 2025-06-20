function uploadFile(fileContent) {
    const url = `file-url-${Math.random().toString(36).substring(2)}`;
    console.log(`Uploading file ${fileContent}. Returning url: ${url}`);
    return url;
}

module.exports = uploadFile;
