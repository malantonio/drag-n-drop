'use strict';

var draggableClassname = 'draggable'
  , d = document.querySelectorAll('.' + draggableClassname)
  ;

Array.prototype.forEach.call(d, setDragonDrop);

/**
 *  adds listeners for the drag + drop events
 */

function setDragonDrop(el) {
  var ref = el
    , parent = el.parentNode
    ;

  el.draggable = true;

  // if this is the element being dragged, set our properties
  el.addEventListener('dragstart', function(e) {
    e.dataTransfer.setData('text/html', this.innerHTML);
    e.dataTransfer.dropEffect = 'move';
  });

  // after we move the element, remove the old one
  el.addEventListener('dragend', function(e) {
    if ( e.dataTransfer.dropEffect === '' ) {
      return;
    } else {
      this.parentElement.removeChild(this);
    }
  });

  // if an element is dragged over ours, make it our ref element
  el.addEventListener('dragover', function(e) {
    e.preventDefault();
    ref = this;
  });

  // if an element is dropped on ours, put the new el on screen
  el.addEventListener('drop', function(e) {
    var data = e.dataTransfer.getData('text/html')
      , li = document.createElement('li')
      , elCoords = this.getBoundingClientRect()
      , elHalfway = elCoords.top + ((elCoords.bottom - elCoords.top) / 2)
      ;

    e.preventDefault();
    li.innerHTML = data;
    li.draggable = true;
    li.className = draggableClassname;
    setDragonDrop(li);

    // determine whether to put the new el before or after the current one
    if ( e.screenY <= elHalfway ) {
      insertBefore(this, li);
    } else {
      insertAfter(this, li);
    }
  });
}

/**
 *  put an element after another
 */

function insertAfter(el, newEl) {
  var nextSibling = el.nextElementSibling
    , parent = el.parentElement
    ;

  if ( nextSibling ) {
    return parent.insertBefore(newEl, nextSibling);
  } else {
    return parent.appendChild(newEl);
  }
}

/**
 *  abstracting out parent.insertBefore
 */

function insertBefore(el, newEl) {
  var parent = el.parentElement;

  return parent.insertBefore(newEl, el);
}
