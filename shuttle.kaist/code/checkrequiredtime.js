module.exports.function = function checkrequiredtime (departure, destination, shuttleType) {

  var departureTime=30,
      destinationTime=60,
      requiredType,
      resultTime=destinationTime-departureTime,
      requiredTime,
      // shuttleType,
      dataTime=require('./shuttletime.js'),
      stops=dataTime.requiredList;

  console.log("11");
  if(typeof(shuttleType) != "undefined"){
    if((typeof(stops[shuttleType][departure]) != "undefined") && (typeof(stops[shuttleType][destination]) != "undefined")){
      // console.log(false&&true)
      requiredType=shuttleType;
      console.log("Dd");
    }
    else{
      throw fail.checkedError("no type", "NoType");
    }
  }
  else{  
    console.log(stops.문지셔틀);
    console.log(stops.OLEV['오리연']);

    if((typeof(stops.OLEV[departure]) != "undefined")  && (typeof(stops.OLEV[destination]) != "undefined")){
      console.log( typeof(stops.OLEV[destination]) != "undefined");
      requiredType='OLEV';
    }
    else if(typeof(stops.문지셔틀[departure]) != "undefined" && typeof(stops.문지셔틀[destination]) != "undefined" ){
      requiredType= '문지셔틀';
    }
    else if(typeof(stops.월평셔틀[departure]) != "undefined" && typeof(stops.월평셔틀[destination] != "undefined" )){
      // console.log("27");
      requiredType='월평셔틀';
    }
    else{
      // console.log("35");
      throw fail.checkedError("no type","NoType");  
    }   
  }
  console.log(requiredType); 

  var duplicatedList=['학사식당','화암 기숙사','문지 캠퍼스','오리연못','영빈관','본관','대강당'];  
  //  console.log(duplicatedList.indexOf('학사식당'));
  var departureBool=0,
      destinationBool=0;
  for(var i=0;i<7;i++){ // bixby tool limitation...
    if(duplicatedList[i]==departure){
      departureBool=1;
    }
  }
  for(var i=0;i<7;i++){
    if(duplicatedList[i]==destination){
      destinationBool=1;
    }
  }

  if(departureBool>0){
    // if(duplicatedList.indexOf(departure) > -1){
    departureTime=dataTime.requiredList[requiredType][departure].출발;
    console.log("41");
  }
  else{
    departureTime=dataTime.requiredList[requiredType][departure];
    console.log("44");
  }

  if(destinationBool > 0){
    // if(duplicatedList.indexOf(departure) > -1){
    console.log("62");
    destinationTime=dataTime.requiredList[requiredType][destination].도착;

  }
  else{
    console.log("80");
    destinationTime=dataTime.requiredList[requiredType][destination];
  }

  //   var urlOLEV="https://www.kaist.ac.kr/_prog/_board/?code=shuttle4&site_dvs_cd=kr&menu_dvs_cd=01070904",
  //       responseOLEV=http.getUrl(urlOLEV,{format: 'text'});   
  //   console.log(responseOLEV);  

  console.log(departureTime);
  console.log(destinationTime);
  // //   
  // //   
  if(departureTime >= destinationTime){
    console.log("we can't go this way");
    throw fail.checkedError("no way","NoWay"); //첫번째꺼는 콘솔에 찍히는겅미. 
    // return requiredTime: 0;
  }
  if(destination)

    resultTime=destinationTime-departureTime

  return {
    requiredTime: resultTime, 
    shuttleType: requiredType
  }
}
