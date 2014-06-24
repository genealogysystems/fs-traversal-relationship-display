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
    
    // Calculate height
    var prevHeight = path[0].height = 0;
    var prevChange = path[0].change = 0;
    path[0].corner = false;
    for(var i = 1; i < path.length; i++){
      var change = 0;
      switch(path[i].relationship){
        case 'child':
          change = -1;
          break;
        case 'mother':
        case 'father':
          change = 1;
          break;
      }
      prevHeight = path[i].height = prevHeight + change;
      path[i-1].corner = (change === 1 && prevChange === -1) || (prevChange === 1 && change === -1);
      prevChange = path[i].change = change;
    }
    path[path.length-1].corner = false;
    
    // Calculate left
    var prevLeft = path[0].left = 0;
    for(var i = 1; i < path.length-1; i++){
      var change = 0;
      if(path[i-1].corner || path[i].corner){
        change = .5;
      }
      else if(path[i].relationship === 'spouse'){
        change = 1;
      }
      prevLeft = path[i].left = prevLeft + change;
    }
    
    console.log(path);
  };

}());