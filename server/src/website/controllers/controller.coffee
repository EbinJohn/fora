conf = require '../../conf'
db = new (require '../../common/database').Database(conf.db)
models = require '../../models'
AppError = require('../../common/apperror').AppError


class Controller        

    ensureSession: (args, fn) =>
        [req, res, next] = args 
        @getUserWithtoken (req.query.token ? req.cookies.token), (err, user) =>
            if user?.id and user?.username
                req.user = user
                fn()
            else
                res.send { error: 'NO_SESSION' }



    attachUser: (args, fn) ->
        [req, res, next] = args
        @getUserWithtoken (req.query.token ? req.cookies.token), (err, user) =>
            req.user = user ? { id: 0 }
            fn()



    getUserWithtoken: (token, cb) ->
        if token
            models.Session.get { token }, {}, db, (err, session) =>
                if not err
                    if session
                        models.User.getById session.userid, {}, db, (err, user) =>
                            user = user?.summarize()
                            cb err, user
                    else
                        cb()
                else
                    cb err
        else                
            cb()


    
    isAdmin: (user) =>
        (u for u in conf.admins when u.username is user?.username).length        
                
                
        
    getValue: (src, field, safe = true) =>
        src[field]
        
    
    
    handleError: (onError) ->
        (fn) ->
            return ->
                if arguments[0]
                    onError arguments[0]
                else
                    fn.apply undefined, arguments
    
    
    
    setValues: (target, src, fields, options = {}) =>
    
        if not options.safe?
            options.safe = true
        if not options.ignoreEmpty
            options.ignoreEmpty = true

        setValue = (src, targetField, srcField) =>
            val = @getValue src, srcField, options.safe
            if options.ignoreEmpty
                if val?
                    target[field] = val
            else
                target[field] = val

        if fields.constructor == Array
            for field in fields
                setValue src, field, field
        else
            for ft, fsrc of fields
                setValue src, ft, fsrc
                


exports.Controller = Controller
