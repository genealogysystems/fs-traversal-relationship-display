(function(){

  // Width of a person box, in px
  var boxWidth = 180;

  window.FSTraversalRelationshipDisplay = function(traversalPath, lang){
  
    if(!lang){
      lang = 'en';
    }
  
    // Modify path data structure
    var path = [];
    for(var i = 0; i < traversalPath.length; i ++){
      path.push({
        person: traversalPath[i].person,
        relationship: traversalPath[i].rel,
        corner: '',
        lines: []
      });
    }
    
    // Calculate height, corner, and lines
    var prevHeight = path[0].height = 0;
    var prevChange = 0;
    var minHeight = 0;
    for(var i = 1; i < path.length; i++){
      
      // Calculate height
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
      
      // Calculate corner value for previous person
      if(change === 1 && prevChange === -1){
        path[i-1].corner = 'bottom';
      } else if(prevChange === 1 && change === -1){
        path[i-1].corner = 'top';
      }
      
      // Calculate lines
      if(path[i].relationship === 'child'){
        path[i].lines.push('top');
        path[i-1].lines.push('bottom');
      } else if(path[i].relationship === 'mother' || path[i].relationship === 'father'){
        path[i].lines.push('bottom');
        path[i-1].lines.push('top');
      } else if(path[i].relationship === 'spouse'){
        path[i].lines.push('left');
      }
      if(path[i-1].corner === 'top'){
        path[i-2].lines.push('top-right');
        path[i].lines.push('top-left');
      } else if(path[i-1].corner === 'bottom'){
        path[i-1].lines.push('top-full');
      }
      
      prevChange = change;
    }
    
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
    
    // Output rows; use inline css positioning for now    
    var html = '',
        maxRight = 180;
    for(var i = 0; i < rows.length; i++){
      html += '<div class="fst-row">';
      var prevLeft = 0;
      for(var j = 0; j < rows[i].people.length; j++){
        var person = rows[i].people[j],
            myLeft = person.left * boxWidth,
            cornerClass = person.corner ? ' fst-corner-' + person.corner : '';
        html += '<div class="fst-person'+cornerClass+'" style="margin-left:'+(myLeft - prevLeft)+'px">';
        html += '<div class="fst-name">'+person.person.display.name+'</div>';
        html += '<div class="fst-role">'+getRelationshipString(person, lang)+'</div>';
        for(var k = 0; k < person.lines.length; k++){
          html += '<div class="fst-line-'+person.lines[k]+'"></div>';
        }
        html += '</div>'; // end person
        prevLeft = myLeft + 180;
      }
      maxRight = Math.max(maxRight, prevLeft);
      html += '</div>';
    }
    
    return '<div class="fst-relationship-display" style="width:'+maxRight+'px">' + html + '</div>';
  };
  
  /**
   * Get the relationship string in the specified language
   */
  function getRelationshipString(person, lang){
    var rel = person.relationship;
    if(rel === 'child'){
      if(person.person.gender.type === 'http://gedcomx.org/Male'){
        rel = 'son';
      } else if(person.person.gender.type === 'http://gedcomx.org/Female'){
        rel = 'daughter';
      } else {
        rel = 'child';
      }
    }
    else if(rel === 'spouse'){
      if(person.person.gender.type === 'http://gedcomx.org/Male'){
        rel = 'husband';
      } else if(person.person.gender.type === 'http://gedcomx.org/Female'){
        rel = 'wife';
      } else {
        rel = 'spouse';
      }
    }
    return languages[lang][rel];
  }
  
  /**
   * Map of available languages and relationship strings
   */
  var languages = window.FSTraversalRelationshipDisplay.languages = {
    en: {
      child: 'child',
      son: 'son',
      daughter: 'daughter',
      mother: 'mother',
      father: 'father',
      spouse: 'spouse',
      wife: 'wife',
      husband: 'husband',
      start: 'start'
    },
    es: {
      child: 'hijo',
      son: 'hijo',
      daughter: 'hija',
      mother: 'madre',
      father: 'padre',
      spouse: 'cónyuge',
      wife: 'esposa',
      husband: 'marido',
      start: 'principio'
    }
  };

}());
