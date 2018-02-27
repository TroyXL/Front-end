(function () {
  function reloadByArgsLength (arg1, arg2, arg3) {
    const length = arguments.length
    if (length === 0) {
      console.log('logic a with no argument')
    } else if (length === 1) { // arg1 is exists
      console.log('logic b with argument arg1', arg1)
    } else if (length === 2) { // arg1 arg2 are exists
      console.log('logic c with arguments arg1 & arg2', arg1, arg2)
    } else { // all arguments are exists
      console.log('logic d with arguments arg1 & arg2 & arg3', arg1, arg2, arg3)
    }
  }

  function reloadByClosure () {
    
  }
}())