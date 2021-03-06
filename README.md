# fs-traversal-relationship-display

Generate an HTML display of an [fs-traversal](https://github.com/genealogysystems/fs-traversal) relationship path.

[View the demo](http://genealogysystems.github.io/fs-traversal-relationship-display/).

### Usage

1. Include the JavaScript and CSS on the page.

    ```html
    <script src="fs-traversal-relationship-display.js"></script>
    <link rel="stylesheet" href="fs-traversal-relationship-display.css">
    ```

2. Pass the result of `FSTraversal.`[`pathTo(id)`](https://github.com/genealogysystems/fs-traversal#pathtoid) directly into `FSTraversalRelationshipDisplay` to generate the HTML display.

    ```javascript
    var path = traversal.pathTo(personId);
    var relationshipHTML = FSTraversalRelationshipDisplay(path);
    ```
3. Add the HTML to the DOM.

4. _Optional_: You may specify a language.

   ```js
   FSTraversalRelationshipDisplay(path, 'es');
   ```
   
   Currently only English `en` and Spanish `es` are supported. Defaults to `en`.