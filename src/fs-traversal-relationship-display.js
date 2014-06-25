(function(){

  // Width of a person box, in px
  var boxWidth = 180;

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
    var prevChange = 0;
    var minHeight = 0;
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
      minHeight = Math.min(prevHeight, minHeight);
      path[i-1].corner = (change === 1 && prevChange === -1) || (prevChange === 1 && change === -1);
      prevChange = change;
    }
    path[path.length-1].corner = false;
    
    // Adjust heights so that the minimum is 0
    if(minHeight < 0){
      var change = Math.abs(minHeight);
      for(var i = 0; i < path.length; i++){
        path[i].height += change;
      }
    }
    
    // Calculate left
    var prevLeft = path[0].left = 0;
    for(var i = 1; i < path.length; i++){
      var change = 0;
      if(path[i-1].corner || path[i].corner){
        change = .5;
      }
      else if(path[i].relationship === 'spouse'){
        change = 1;
      }
      prevLeft = path[i].left = prevLeft + change;
    }
    
    // Group people into rows based on height
    var rowsMap = {};
    for(var i = 0; i < path.length; i++){
      var rowNumber = path[i].height;
      if(!rowsMap[rowNumber]){
        rowsMap[rowNumber] = [];
      }
      rowsMap[rowNumber].push(path[i]);
    }
    
    // Sort rows in reverse according height
    var rows = [];
    for(var n in rowsMap){
      rows.push({
        number: parseInt(n),
        // Sort people in the row too according to left position
        people: rowsMap[n].sort(function(a, b){
          return a.left - b.left;
        })
      });
    }
    rows.sort(function(a, b){
      return b.number - a.number;
    });
    
    console.log(path);
    console.log(rows);
    
    // Output rows; use inline css positioning for now    
    var html = '',
        maxRight = 180;
    for(var i = 0; i < rows.length; i++){
      html += '<div class="fst-row">';
      var prevLeft = 0;
      for(var j = 0; j < rows[i].people.length; j++){
        var person = rows[i].people[j],
            myLeft = person.left * boxWidth;
        html += '<div class="fst-person" style="margin-left:'+(myLeft - prevLeft)+'px">';
        html += '<div class="fst-name">'+person.person.display.name+'</div>';
        html += '<div class="fst-role">'+getRelationshipString(person)+'</div>';
        html += '</div>';
        prevLeft = myLeft + 180;
      }
      maxRight = Math.max(maxRight, prevLeft);
      html += '</div>';
    }
    
    return '<div class="fst-relationship-display" style="width:'+maxRight+'px">' + html + '</div>';
  };
  
  function getRelationshipString(person){
    var rel = person.relationship;
    if(rel === ''){
      return 'you';
    }
    else if(rel === 'child'){
      if(person.person.gender.type === 'http://gedcomx.org/Male'){
        return 'son';
      } else if(person.person.gender.type === 'http://gedcomx.org/Female'){
        return 'daughter';
      } else {
        return 'child';
      }
    }
    return rel;
  };

}());