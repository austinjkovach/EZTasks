function dragStart(e) {

  //==> store data-info attribute

  e.dataTransfer.setData("text", e.target.dataset.info)
}


// TODO REFACTOR THIS
function dropContent(e) {

  //==> If setting one card on top of another, want to target parent container
  var target = e.target
  console.log('drop target:', target)

  var targetDataId = target.dataset.columnId

  console.log('drop target id:', targetDataId)


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
  var id = card.dataset.id
  var cardInputs = card.querySelectorAll('input')
  var postData = { day: target.dataset.columnId }

  for( var i=0; i<cardInputs.length; i++ ) {
    var currentInput = cardInputs[i]

    postData[currentInput.name] = currentInput.value
  }
  console.log('postData', postData)

  post('/tasks/changeday/' + id, postData)

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