import Filter from 'bad-words'


export const filterProfanity = (userInput) => {
  try {
    if(!(typeof userInput === 'string' || userInput instanceof String)&&userInput.length>1){
      userInput=userInput[0].text
    }
    //console.log(userInput)
    if(userInput!=null && userInput.split(/\b/).length!=null){
      return userInput;
    }
    const filter = new Filter()
    let cleanedText = ''
    if (/^\*+$/.test(userInput)) {
      cleanedText = userInput
    } else {
      cleanedText = filter.clean(userInput)
    }
    return cleanedText
    
  } catch (error) {
    return userInput
  }
  
}
