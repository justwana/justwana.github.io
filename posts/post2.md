---
title: "Understanding JavaScript Closures"
author: "Jane Smith"
date: "2023-10-27"
category: "Programming"
summary: "A deep dive into JavaScript closures and how they work."
---

## JavaScript Closures Explained

Closures are a fundamental concept in JavaScript. A closure gives you access to an outer function's scope from an inner function.

```javascript
function init() {
  var name = "Mozilla"; // name is a local variable created by init
  function displayName() { // displayName() is the inner function, a closure
    alert(name); // use variable declared in the parent function
  }
  displayName();
}
init();
```

Understanding closures is key to becoming a proficient JavaScript developer.
