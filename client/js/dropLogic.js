function dragStart(e) {

  //==> store data-info attribute

  e.dataTransfer.setData("text", e.target.dataset.info)
}

function dropContent(e) {

  //==> If setting one card on top of another, want to target parent container
  var target = e.target
  if(target.classList.contains('card')) {
    target = target.parentNode
  }

  //==> Avoid adding card to things that aren't storage or columns
  if( !(target.classList.contains('card-holder')) && !(target.classList.contains('storage')) ) {
    return;
  }
  //==> return data-info attribute from store
  var data = e.dataTransfer.getData("text")

  //=> returns node based on data-info attribute
  var card = document.querySelector('[data-info="' + data + '"]')

  //==> append node to target
  target.appendChild(card)
}

// required to allow dropping:
// https://msdn.microsoft.com/library/ms536929(v=vs.85).aspx
function allowDrop(e) {
  e.preventDefault()
}
