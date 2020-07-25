const generateMessages = (text)=>{
    return {
        text:text,
        createdAt:new Date().getTime()
    }
} 

const genereatLocation = (url)=>{
    return {
        url:url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessages,
    genereatLocation
}