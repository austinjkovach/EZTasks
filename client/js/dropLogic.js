var cardSuccess = document.querySelectorAll('.card-button.success')

for(var i=0;i<cardSuccess.length;i++) {
  cardSuccess[i].addEventListener('click', function(e) {

    var id = e.target.parentNode.parentNode.dataset.id
    var text = e.target.parentNode.querySelector('input:nth-child(2)').value
    var completed = !e.target.parentNode.querySelector('input[name="completed"]').checked
    var starred = e.target.parentNode.querySelector('input[name="starred"]').checked

    var postData = { completed: completed, text: text, starred: starred }
    post('/tasks/edit/' + id, postData)
  })
}

var cardStarred = document.querySelectorAll('.card-button.starred')

for(var i=0;i<cardStarred.length;i++) {
  cardStarred[i].addEventListener('click', function(e) {
    console.log('e', e)
    var id = e.target.parentNode.parentNode.dataset.id
    var text = e.target.parentNode.querySelector('input:nth-child(2)').value
    var completed = e.target.parentNode.querySelector('input[name="completed"]').checked
    var starred = !e.target.parentNode.querySelector('input[name="starred"]').checked

    var postData = { completed: completed, text: text, starred: starred }
    post('/tasks/edit/' + id, postData)
  })
}

function dragStart(e) {

  //==> store data-info attribute
  e.dataTransfer.setData("text", e.target.dataset.info)
}


// TODO REFACTOR THIS
function dropContent(e) {

  //==> If setting one card on top of another, want to target parent container
  var target = e.target
  var targetDataId = target.dataset.columnId

  if(target.classList.contains('card-text')) {
      console.log('target:', target)

      target = target.parentNode.parentNode
      console.log('POOF', target)
  }

  //==> Avoid adding card to things that aren't storage or columns
  if( !(target.classList.contains('card-holder')) && !(target.classList.contains('storage')) ) {
    return;
  }
  //==> return data-info attribute from store
  var data = e.dataTransfer.getData("text")

  //=> returns node based on data-info attribute
  var card = document.querySelector('[data-info="' + data + '"]')


  //=> Grab form values from inputs
  var id = card.dataset.id

  var cardInputs = card.querySelectorAll('input')
  var postData = { assigned_time: target.dataset.columnId }

  for( var i=0; i<cardInputs.length; i++ ) {
    var currentInput = cardInputs[i]

    if(currentInput.type === "checkbox") {
      postData[currentInput.name] = currentInput.checked
    }
    else {
      postData[currentInput.name] = currentInput.value
    }
  }
  console.log('click postData', postData)
  post('/tasks/edit/' + id, postData)

  //==> append node to target
  //==> Not needed now that we refresh page
  // target.appendChild(card)
}

// required to allow dropping:
// https://msdn.microsoft.com/library/ms536929(v=vs.85).aspx
function allowDrop(e) {
  e.preventDefault()
}




/*

 THIS FEELS SO WRONG
 http://stackoverflow.com/questions/133925/javascript-post-request-like-a-form-submit

*/

function post(path, params) {

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);

            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
         }
    }

    document.body.appendChild(form);
    form.submit();
}