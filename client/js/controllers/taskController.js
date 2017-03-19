var dataInfoCounter = 1;

function addItem(e) {

  e.preventDefault()

  var addItemField = document.querySelector('form').elements.addItemField
  var newCard = document.createElement('div')
  var storage = document.querySelector('.storage')
  var text = addItemField.value

  if(text.trim() === '') {
    addItemField.value = ""
    return;
  }

  addAttrsToCard(newCard, text, dataInfoCounter)

  storage.appendChild(newCard)
  addItemField.value = ""
  dataInfoCounter++
}

function deleteTask(e) {
  var id = e.target.parentNode.dataset.info;

  // var target = document.querySelector('[data-info="' + info + '"]')
  // target.remove()
}

function addAttrsToCard(card, text, counter) {

  var textDiv = document.createElement('div')
  var successDiv = document.createElement('div')
  var deleteDiv = document.createElement('div')

  textDiv.classList.add('card-text')
  successDiv.classList.add('card-success')
  deleteDiv.classList.add('card-danger')

  card.classList.add('card')

  card.appendChild(textDiv)
  card.appendChild(successDiv)
  card.appendChild(deleteDiv)


  deleteDiv.addEventListener('click', deleteItem)
  successDiv.addEventListener('click', toggleItem)

  textDiv.textContent = text
  successDiv.textContent = ":)"
  deleteDiv.textContent = "X"

  card.dataset.info = '' + counter

  card.setAttribute('draggable', true)
  card.setAttribute('ondragstart', "dragStart(event)")
  card.setAttribute('ondragover', "allowDrop(event)")

}


function toggleItem(e) {
  var info = e.target.parentNode.dataset.info;
  var target = document.querySelector('[data-info="' + info + '"]')

  target.classList.toggle("complete");
}


/////////////////////////////////////////////


