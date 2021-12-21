const fs = require("fs");
var data = fs.readFileSync(__dirname+"/data.txt");
var testData = {};
var splitList = data.toString().split("\n");
//console.log(splitList)
var Dat = [];
for (var i = 0; i < splitList.length; i++) {
    const splitted = splitList[i].toString().split(":");
    testData[splitted[0]] = splitted[1];
    //console.log(testData)
    if(splitted[0] ==''){
        Dat.push(testData);
        testData={};
    }
}
console.log(Dat)
var newData=[];
let a =0;
for(let text of Dat){
    var secondKey = Object.keys(Dat[a])[1] ;    
    const split = text.Stars.toString().split(",");
    newData.push({title:text.Title,year:Dat[a][secondKey],format:text.Format,actors : split})
    a=a+1;
}
for(let j of newData){
    console.log(j)
}
module.exports = newData;