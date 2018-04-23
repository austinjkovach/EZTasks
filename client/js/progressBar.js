// progress bar logic
var progBar;

setTimeout(function() {
  progBar = document.querySelector('.progress-bar')
  progBar.style.width = window.localStorage.getItem("ezTasksProgressBarWidth")

  var targetHue = (progBar.style.width * 100) * 1.2
  progBar.style.backgroundColor = "hsla( " + targetHue + ", 100%, 50%, 1)";

}, 0)

setTimeout(function() {
  var setWidth = completedTasksLength / tasksLength;
  var setWidthString = '' + (setWidth * 100) + '%'
  var targetHue = (setWidth * 100) * 1.2

  progBar.style.transition="width, background-color, .5s cubic-bezier(1, 0.5, 0.5, 1)";
  progBar.style.width = setWidthString

  window.localStorage.setItem("ezTasksProgressBarWidth",  setWidthString)
  progBar.style.backgroundColor = "hsla( " + targetHue + ", 100%, 50%, 1)";

}, 100)