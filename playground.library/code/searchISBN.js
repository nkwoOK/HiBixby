module.exports.function = function searchBookLocation (iSBN) {

  if(iSBN==undefined){
    throw fail.checkedError("No ISBN","NoISBN");  
  }
  else if(iSBN.length!=13){
    throw fail.checkedError("No ISBN","NoISBN");  
  }
  
  var uri='https://isbnsearch.org/isbn/'+iSBN



  console.log(uri)

  return {
    uri: uri
  }
}
