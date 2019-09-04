module.exports.function = function searchbooks (title, author, borrowable, category, period, libraryEnum) {

  //input 갯수에 따라서 form이 달라지겠는데?
  // ampersand 이용해서 엮기만 하면 순서 상관없는 것 같음. 우리가 건드려야 하는거는 s_keyword 정도 이고, 
  // (API메뉴얼에 따라)초기 검색 옵션으로 가능한 것은 자료명, 저자, 주제, 출판사 이 3개를 먼저 짜보고 말씀 드려보자.
  // 짜는 방식: 입력 갯수 센 다음에 옵션으로 넣음.
  // json형식으로 넣으려다가 그냥 3개-3개고 순서 상관 없어서 변수 통으로 진행
  var s_keyword01='', s_keyword02='', s_keyword03='',
      s_column01='', s_column02='', s_column03='';
  var filename='/images/0.jpg';
  // var keyArray=[];
  //splice

  // console.log(libraryEnum)
  if(title!='' && title!=undefined){
    // keyArray.push({title:'TI'})
    s_keyword01=title.replace(/ /gi,'%20');
    s_column01='AL'
    //다 통합검색으로 해 버릴수도 있지만 그래도 ㅎㅎ..
  }
  if(author!='' && author!=undefined){
    // console.log(20)
    console.log(author)
    s_keyword02=author[0].replace(/ /gi,'%20')
    s_column02='AU'
    console.log(20)
  }
  if(category!='' && category!=undefined){
    console.log(24)
    s_keyword03=category
    s_column03='SU'
  }
  
  
  //아 근데 ampersand 못 무시함!

  var librarySummary='http://library.kaist.ac.kr/tmpApi/openAPI_allsearch.do?authkey=app&s_keyword01='+s_keyword01+'&s_column01='+s_column01+'&s_keyword02='+s_keyword02+'&s_column02='+s_column02+'&s_keyword03='+s_keyword03+'&s_column03='+s_column03+'&search_gubun=@M3m@RG0@DG0&page=1&pageSize=20';


  console.log(librarySummary)
  console.log(http.getUrl(librarySummary, { format: 'xmljs' }))
  var responseSummary = http.getUrl(librarySummary, { format: 'xmljs' }).allsearch.books.row;
  console.log(responseSummary);
  console.log(author +'~'+category+'~' + title)
  // console.log(/\s/.exec(example));
  // console.log(example.split(' '))

  var bookArray=[], locationStructureArray=[],
      libraryDetail, responseDetail,
      parseTarget, periodParse, locationParse;
  // locationRawArray[];
  if(responseSummary==undefined){ //에러처리좀 하자.
    throw fail.checkedError("No Book","NoBook");
  }

  for (var i=0;i<responseSummary.length;i++){
    locationStructureArray=[];
    periodParse=''; //이렇게 안하고 경우에 따라 갯수를 조절할 수 있겠다만 좀 그럴 듯? view부터 손봐야 하니까

    if(responseSummary[i]==undefined){
      // console.log('nuill')
      // responseSummary.splice(i,1)
      // i--;
      continue;
    }

    libraryDetail='http://library.kaist.ac.kr/openAPI/bookInfoList.do?argBIBCTRLNO=' + responseSummary[i].bibctrlno;
    // Detail을 적극적으로 이용한 코드
    try{
      responseDetail=http.getUrl(libraryDetail, {format: 'xmljs'}).resultSet.BookInfo;
    }
    catch(e){
      responseDetail=undefined
      continue;
    }
    console.log('response:')
    console.debug(responseDetail) 
    
    // console.debug('ddd', responseDetail.ISBN)

    // 한 책에 하나만 대응될 때 의미. 

    //responseDetail이 존재하지 않는 경우 발생.!!!! 여기서도 필터링 조건 있는 경우에는 ?
    if(responseDetail==undefined  ){
      bookArray[i]={
        title: responseSummary[i].title,
        author: responseSummary[i].author,
        //여기를 key value 값 가지게 만들어야 
        locationStructure: undefined,
        // {location: undefined, borrowable: undefined},
        period: undefined,
        fileName: '/images/0.jpg'
      }
      continue;
    }

    // console.log('detail length: '+ responseDetail.length)

    var callnoLength=0;
    if(responseDetail.length==undefined){
      if(callnoLength=responseDetail.CALLNO.length>4){
        // if(callnoLength>4) //에러 막기
        periodParse=responseDetail.CALLNO.substring(callnoLength-4,callnoLength)
      }
      locationStructureArray.push({location: responseDetail.LOCATION_NAME, borrowable: responseDetail.MTRLSTATUS_NAME, iSBN: responseDetail.ISBN})
    }
    else{
      if(callnoLength=responseDetail[0].CALLNO.length>4){

        periodParse=responseDetail[0].CALLNO.substring(callnoLength-4,callnoLength)
      }
      for(var k=0;k<responseDetail.length;k++){
        locationStructureArray.push({location: responseDetail[k].LOCATION_NAME, borrowable: responseDetail[k].MTRLSTATUS_NAME, iSBN: responseDetail[k].ISBN})
      }
    }

    if(!(periodParse<2020 || periodParse>1000)){
      periodParse=undefined
    }

    // parseTarget=responseSummary[i].location //위치, 출판년도
    // if(parseTarget!=undefined){
    // location이 없는 것도 있다. 그럼 넘어!
    // 문제: 배열과 문자열 모두 indexing이 가능하여 우리를 혼란스럽게 한다. 


    // console.log('dd')
    // console.log(locationStructureArray)
    // console.log("우루루우"+stringfy(locationStructureArray))
    //여기서 유의할 점: location이 하나면 바로 index되지만 더 많다면 indexing을 따로 해야 해서 고려해야함.==> many로 해서 고친듯


    //filename
    for(var j=0;j<locationStructureArray.length;j++){
      if(locationStructureArray[j].borrowable=='이용가능'){
        filename='/images/1.jpg'
        break;
      }
      else if(locationStructureArray[j].borrowable=='대출중')
        filename='/images/2.jpg'
    }
    
    bookArray[i]={
      title: responseSummary[i].title,
      author: responseSummary[i].author,
      //여기를 key value 값 가지게 만들어야 

      locationStructure: locationStructureArray,
      period: periodParse,
      fileName: filename
    }

    
    
    
    
    
    console.log('웅웅')
    // console.log(bookArray[i])
    // 이제 조건부로 리턴하는거
    // 대출 가능한 XX 뭐이렇게 나오면 여기서 pop해주면 될 것 같다.

  } 
  console.log(3)
  console.log(bookArray)
  // console.log('fff');
  // console.log('period' +period)



  if(borrowable!=undefined || libraryEnum!=undefined){ // 검색 조건이 있을 때
    for(var i=0;i<bookArray.length;i++){ //조건 따져줄때
      // console.log(i);
      // var lengthVar=bookArray[i].locationstructure.length

      if(bookArray[i].locationStructure==undefined){ // 이 부분의 코드: locationstruc이 없는 것 또한 제거했어야 하는데, 굳이 undefined 남기고 길이에 포함시킬 이유 없었기 때문 
        
        bookArray.splice(i,1)
        i--;
        console.log('ㅇㅅㅇ')
        continue; // 첫 자리에서 continue가 없으ㅕㅁㄴ index -1됨. 
      }
      
      for(var j=0;j<bookArray[i].locationStructure.length;j++){
        // console.log(bookArray[i].locationstructure[j].borrowable)
        if(borrowable!=undefined && bookArray[i].locationStructure[j].borrowable!=borrowable){

          bookArray[i].locationStructure.splice(j,1) //배열에 변화 생김
          console.log(i+'책의' +j+ ' 를제거했다')
          // console.log(bookArray[i])
          j--;
        } 
        else if(libraryEnum!=undefined && !bookArray[i].locationStructure[j].location.includes(libraryEnum)){ 
          //여기서 또 문제: 복잡하게 나오는 문자열을 정리해서 간단하게 분류해줘야함. ==> 그냥 includes 했다. 

          console.log('들어옴'+ libraryEnum + bookArray[i].locationStructure[j].location)
          bookArray[i].locationStructure.splice(j,1)
          j--;
        }
        //       
      }
      //여기서 문제: 몇년 이후 / 이전 책 어떻게 찾나..... 0/1/2해서 분류할 수 있긴 하네  struc으로 받아서 다 case 나눠야 하나 싶기도...
      //그냥 트레이닝을 잘 해보기로 하였다. 그리고 좀 나중 단계에 하자...
      // }

      if(bookArray[i].locationStructure.length==0 ){ //location 하나도 없으면 버림!
        bookArray.splice(i,1)
        i--;
        console.log('ff');

      }
      // console.log(bookArray[i].locationstructure)
    }
  }

  console.debug("ㄱㄱ",bookArray)


  return bookArray


}

