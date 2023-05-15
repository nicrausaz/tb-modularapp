import fileUpload from 'express-fileupload'

const config: fileUpload.Options = {}

export const uploader = fileUpload(config)