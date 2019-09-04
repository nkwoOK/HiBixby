module.exports.function = function checkleavetime (departure, shuttleType, time) {
  console.log("start");
  var nowZone=new dates.ZonedDateTime.now(),
      now = nowZone.getDateTime(), // object type, 왜 doc 못 봤을까
      // nowHour=now.getHour(),
      // nowMinute=now.getMinute();
      dataTable=require('./shuttletable.js').table,
      resultTime,
      leaveTime,
      remainTime=0,
      leaveTime=[];

  // if(typeof(shuttleType) != ){
  //   throw fail.checkedError("no Type","NoType");
  // } // 셔틀오류는 액션에서 이미 처리한 바 있음.

  //자동으로 해석해서 준다!! 

  // console.log(now.time);
  // console.log(typeof(shuttleType));//얘는 객체
  // var ii="ff"
  // console.log(typeof(ii));//얘는 스트링
  // console.log(departure);
  // console.log(nowZone.getDayOfWeek());

  // var t=new dates.ZonedDateTime.of([],[] ,[] ,[8],[45]).getDateTime(); ==> 이렇게 하는 것보다 viv.time.Time으로 꼴 맞추는게 더 낫다! 
  // console.log((8 <= now.time.hour || now.time.hour <= 16))


  switch(String(shuttleType)){
    case 'OLEV': 

      if(!(typeof(time)==="undefined")){
        timeHour=time.dateTime.time.hour;
        
        if(8>=timeHour || timeHour >=17)
          throw fail.checkedError("No Bus","NoBus");

        var timeArray=dataTable.OLEV[departure][timeHour];
        for(var i=0;i< timeArray.length;i++){
          resultTime = {
            hour:timeHour,
            timezone: now.time.timezone,
            minute: timeArray[i],
            second: 0
          }
          leaveTime.push(resultTime);
        }
        break;
      }

      else{
      // console.log("adadadad");
        if(nowZone.getDayOfWeek()===6 || nowZone.getDayOfWeek()===7) //주말
          throw fail.checkedError("No Bus","NoBus");

        if(8 >= now.time.hour || now.time.hour >= 17) // 시간
          throw fail.checkedError("No Bus","NoBus");

        // 바로 for문 가면 됩니까?
        var timeArray=dataTable.OLEV[departure][now.time.hour];
        for(var i=0;i< timeArray.length;i++){
          if(now.time.minute < timeArray[i]){
            remainTime=timeArray[i]-now.time.minute;
            resultTime = {
              hour:now.time.hour,
              timezone: now.time.timezone,
              minute: timeArray[i],
              second: 0
            }
            leaveTime.push(resultTime);
            // resultTime=new dates.ZonedDateTime.of([],[] ,[] ,[now.time.hour],[timeArray[i]]);
            console.log("42");
            break;
            // console.log("43");
          }
        } //이 때 55분 이후라면>?!
        if(remainTime==0){

          console.log("44");
          timeArray=dataTable.OLEV[departure][now.time.hour+1];
          resultTime = {
            hour:now.time.hour+1,
            timezone: now.time.timezone,
            minute: timeArray[0],
            second: 0
          }
          // resultTime=new dates.ZonedDateTime.of([],[] ,[] ,[now.time.hour+1],[timeArray[0]]);    //getDateTime()
          remainTime=60+timeArray[0]-now.time.minute;
        }
        break;
      }

    default:
      throw fail.checkedError("invaild Type","InvalidType");

  }  
  console.log(resultTime, remainTime)
  console.log(typeof(resultTime))
  return {
    leaveTime: leaveTime,
    remainTime: remainTime
  }
}










// console.log(now.getHour() +" "+ now.getMinute());
// console.log();
// var now1=new Date.now();





//시간 계산 하는 법





//   var txtfile=new document.getElementById('sample.txt');
// console.log(txtfile);



// read files

// var openfile= function(event){
//   var input=event.target;
//   var reader=new FileReader();
//   reader.onload=function(){
//     var dataURL=reader.result,
//         sample=document.getElememtById('sample');
//     sample.src=dataURL;
//     };
//   reader.readAsDataURL(input.files[0]); 
// };


//   
//   var filepath= "C:\Users\user\bixby-workspace\shuttle.kaist\code\sample.txt";
//   var txtfile=new File(filepath);
//   var str= "파일 시작";
//   file.open("r");
//   
//   while(!txtfile.eof){
//     str+=txtfile.readln()+"\n";
//   }
//   console.log(str);

//   

