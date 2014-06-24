(function(){

  window.FSTraversalRelationshipDisplay = function(traversalPath){
  
    // Setup more simple data structure
    var path = [{
      person: traversalPath[0],
      relationship: ''
    }];
    for(var i = 1; i < traversalPath.length; i += 2){
      path.push({
        person: traversalPath[i+1],
        relationship: traversalPath[i]
      });
    }
    
    console.log(path);
  
  };

}());