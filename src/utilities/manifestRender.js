const manifestRender = (anchorElement, manifest) => {
    console.log('inside manifestRender:')
    console.log(manifest)
}
//input: list vs dict?  (try multi file stream)
module.exports = { manifestRender }

//- show "protected/encrypted" on time_created, manifest_string if file masking enabled and not decrypted yet