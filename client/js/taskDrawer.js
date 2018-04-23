var cards = document.querySelectorAll('.card');

for(var i=0;i<cards.length;i++) {
  var card = cards[i];

  card.addEventListener('click', function(e) {
    var currentNode = e.target
    while(!currentNode.classList.contains('card')) {
      currentNode = currentNode.parentNode
    }
    console.log('parentNode', currentNode)

  })
}
