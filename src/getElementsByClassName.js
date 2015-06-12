// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

var getElementsByClassName = function(className){
    var newArr = [];
    getClass(document.body);
    function getClass(item) {        
        var itemClass = item.classList;
        if (itemClass) {
            if (itemClass.contains(className)) {
                newArr.push(item);    
            }            
        }
        var itemNode = item.childNodes;
        for (var i = 0 ; i < itemNode.length; i++) {            
            getClass(itemNode[i]);
        }      
    }    
    return newArr;
}
