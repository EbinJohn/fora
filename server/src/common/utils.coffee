root = exports ? this

clone = (source) ->
    obj = {}
    extend obj, source
    return obj

extend = (target, source) ->
    for key, val of source
        if typeof val != "function"
            target[key] = val


isComposite = (dataType) ->
    return dataType != 'Text' && dataType != 'Number' && dataType != 'Boolean' && dataType != 'DateTime' && dataType != 'Selection' && dataType != 'HTML' && dataType != 'File'


mergeObjects = (target, source) ->
    mergeArrays = (targetArr, sourceArr) ->
        newArr = []
        for item in sourceArr
            matches = (x for x in targetArr when x.name is item.name)
            if matches.length > 0
                mergeObjects matches[0], item
            else
                newArr.push item
        for item in targetArr
            newArr.push item
        targetArr.length = 0 #clear(). Not a hack. ECMAScript standard.
        for item in newArr
            targetArr.push item

    for key, val of source
        if not target[key]
            target[key] = val
        else
            if val
                if val instanceof Array
                    mergeArrays target[key], val
                else if typeof val is 'object'
                    mergeObjects target[key], val
    return


mergeLinkedObjects = (obj, fieldName) ->
    if obj[fieldName]
        mergeLinkedObjects obj[fieldName], fieldName
        mergeObjects obj, obj[fieldName]


uniqueId = (length=16) ->
  id = ""
  id += Math.random().toString(36).substr(2) while id.length < length
  id.substr 0, length
  

fixUrl = (url) ->
    if /http:\/\//.test(url)
        url    
    else
        "http://#{url}"        

        
dumpError = (err) ->
    if err
        if typeof err is 'object'
            if err.message
                console.log '\nError: ' + err.message
        
        if err.stack
            console.log('\nStacktrace:')
            console.log('===========')
            console.log(err.stack)
        else
            console.log("Error: #{JSON.stringify(err)}")
    else
        console.log 'Error: null or undefined.'
    
root.clone = clone
root.extend = extend
root.isComposite = isComposite         
root.mergeObjects = mergeObjects
root.mergeLinkedObjects = mergeLinkedObjects
root.uniqueId = uniqueId
root.fixUrl = fixUrl
root.dumpError = dumpError
