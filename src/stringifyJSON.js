// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:
var stringifyJSON = function(obj) {  
  if (typeof obj === "object") {
  	for (var keyZ in obj) {
    	if (typeof obj[keyZ] === "function") {
      	return "{}";
    	}
  	}    	
  }
  var resString = "";
  //stringifies strings
  if (typeof obj === "string") {
    return stringifyString(obj);
  }
  
  function stringifyString(string) {
    resString += '"' + string + '"';
    return resString;
  }
  
  //stringifies plain inputs
  if (typeof obj !== "object" && typeof obj !== "string") {
    console.log("this is not an object", obj);
    return stringifyNonObj(obj);
  }
  
  function stringifyNonObj(input) {
    resString += input; 
    return resString;
  }
  
  //stringifies null
  if (obj === null) {
    return stringifyNull(obj);
  }
  
  function stringifyNull(obj) {
    return "null";
  }  
  
  if (Array.isArray(obj) && (!(typeof obj[0] === "object" && !Array.isArray(obj[0])))) { 
    var resString = "";  
    if (Array.isArray(obj) && obj.length > 1) {
      resString += "[";
      return stringifyArray(obj, 0);
    }
    
    if (Array.isArray(obj) && obj.length < 2) {    
      resString+= "[";
      return onionArr(obj);
    }    
  }
  function onionArr(array) {
    if (array.length < 1) {
      return "[]";
    }
    var counter = 0, arrayValue;
    while (true) {      
      if (!Array.isArray(array)) {
        arrayValue = array;
        break;
      }
      array = array[0];
      counter++;
    }        
    var timesToRepeat = counter - 1;
    for (var i = 0 ; i < timesToRepeat; i++) {
      resString += "[";
    }
    if (typeof arrayValue === "string") {
      resString += '"' + arrayValue + '"';      
    } else {
      resString += arrayValue;
    }
    for (var i = 0 ; i < timesToRepeat +1; i ++) {
      resString+= "]";
    }
    return resString;
  }  
  function stringifyArray(array, index) {
    if (Array.isArray(array)) {
      //resString += "[";
      for (var i = index; i < array.length; i++) { 

        if (Array.isArray(array[i])) {
          resString += "["; 
          for (var j = 0 ; j < array[i].length; j++) {
            if (array[i][j].length === 0) {
              resString += "[]";
            }                   
            if (array[i].length > 1) {
              if (j === array[i].length-1 && typeof(array[i][j]) === "number") {
                resString += array[i][j] + "]";
              } else {
                resString += array[i][j] + ",";              
              }                     
            }
  
          }
          if (index !== array.length-1) {
            return stringifyArray(array, index+1);  
          } else {
            return stringifyArray(array[0], 0);
          }        
        }
        if (!Array.isArray(array[i]) && array.length > 1) {    
          if (i === array.length - 1) {
            if (typeof array[i] === "string") {
              resString += '"' + array[i] + '"';
            } else {
              resString += array[i];              
              
            }
          } else {
            if (typeof array[i] === "string") {
              if (resString[resString.length-1] === ":") {
                resString += "[";
              }
              resString += '"' + array[i] + '"' + ",";
            } else {
              resString += array[i] + ',';              
            }            
          }          
          return stringifyArray(array, index+1)
        }         
      }          
    }
    resString += "]";
    if (resString[0] === "{") {
      resString += "}";
    }    
    return resString;
  }    
  
  var resString = "";
  if (typeof obj === "object" && !Array.isArray(obj)) {
    return classifyObj(obj);
  }    
  
  function classifyObj(obj) {
    var count = 0;     
    for (var k in obj) {
      if (obj.hasOwnProperty(k)) {
        if (obj[k] !== null && typeof obj[k] === "object") {
          return stringifyNestedObj(obj)
        }
        count++;
      }
    }
    if (count < 2) {   
      return stringifySingleObject(obj);
    } else if (count > 1) {
      return stringifyMultiObject(obj);    
    }
  }   

  function stringifySingleObject(obj) {    
    resString += "{";    
    for (var k in obj) {
      resString += '"' + k + '"' + ":" + '"' + obj[k] + '"';
    }    
    resString += "}";
    return resString;    
  }
  
  function stringifyMultiObject(obj) {
    resString += "{";
    for (var k in obj) {
      if (obj[k] !== "string") {
        resString += '"' + k + '"' + ":" + obj[k] + ",";
      } else {
        resString += '"' + k + '"' + ":" + '"' + obj[k] + '",';        
      }
    }    
    resString = resString.slice(0,resString.length-1)
    resString += "}";
    return resString;
  }    
  
  function stringifyNestedObj(obj) {  
    if (!(typeof obj === "object")) {      
      resString += '"' + obj + '"}}';
      return resString;
    } 
    for (var key in obj) {    
      if (typeof obj === "object" && !Array.isArray(obj)) {                    
        if (resString[resString.length-1] !== ',' && resString[resString.length-1] !== "}") {
          resString += "{";                
        }  
        resString += '"' + key + '":';                   
        var objKey = obj[key];
        if (objKey.length < 1 && Array.isArray(objKey)) {
          resString += "[],";
        } 
        else {
          for (var z in objKey) {
            return stringifyNestedObj(objKey);                  
          }
          if (typeof objKey === "boolean") {
            resString += objKey;
          }
          if (resString[resString.length-1] === ":") {
            resString += "{},";
          }
        }        
      } else {        
        return stringifyArray(obj, 0);
      }
    }   
    resString += "}";
    return resString;

  }    

  if (Array.isArray(obj) && ((typeof obj[0] === "object" && !Array.isArray(obj[0])))) {
    return stringifyObjInArray(obj);
  }    
  
  function stringifyObjInArray(obj) {
    resString += "[";
    for (var i = 0 ; i < obj.length; i++) {
      resString += stringifySingleObjectInd(obj[i]) + ",";
    }
    //resString += ;
    resString = resString.slice(0,resString.length-1);
    resString += "]";
    return resString;
  }  
  function stringifySingleObjectInd(obj) {    
    var resString1 = "{";    
    for (var k in obj) {
      resString1 += '"' + k + '"' + ":" + '"' + obj[k] + '"';
    }    
    resString1 += "}";
    return resString1;    
  }    
  return resString;
}