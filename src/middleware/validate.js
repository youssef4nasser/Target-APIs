
export const validate = (schema, token = false)=>{
    return (req, res, next)=>{
        let inputs = {...req.params, ...req.body, ...req.query}
        // validate token from headers
        if(req.headers.token && token == true){
            inputs = {token: req.headers.token}
        }
        // validate files
        if (req.file || req.files) {
            inputs.file = req.file || req.files
        }

        const {error} = schema.validate(inputs, {abortEarly: false})
        const errors = []
        if (error) {
            error.details.forEach(element => {
                errors.push({message: element.message, field: element.path[0]})
            });
            return res.status(400).json({message: 'Invalid request data', errors})
        }
        next()
    }
}
