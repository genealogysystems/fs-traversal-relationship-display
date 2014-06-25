fs-traversal-relationship-display
=================================

Generate an HTML display of an [fs-traversal](https://github.com/genealogysystems/fs-traversal) relationship path.

[Demo](http://genealogysystems.github.io/fs-traversal-relationship-display/).

## Usage

1. Include the JavaScript and CSS on the page.

    ```html
    <script src="fs-traversal-relationship-display.js"></script>
    <link rel="stylesheet" href="fs-traversal-relationship-display.css">
    ```

2. Pass the result of `FSTraversal.`[`pathTo(id)`](https://github.com/genealogysystems/fs-traversal#pathtoid) directly into `FSTraversalRelationshipDisplay` to generate the html display.

    ```javascript
    var path = traversal.pathTo(personId);
    var relationshipHTML = FSTraversalRelationshipDisplay(path);
    ```
3. Add the HTML to the DOM.
