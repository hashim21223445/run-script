'use strict'

const cmd = (input) => {
  if (!input.length) {
    return '""'
  }

  let result
  if (!/[ \t\n\v"]/.test(input)) {
    result = input
  } else {
    result = '"'
    for (let i = 0; i <= input.length; ++i) {
      let slashCount = 0
      while (input[i] === '\\') {
        ++i
        ++slashCount
      }

      if (i === input.length) {
        result += '\\'.repeat(slashCount * 2)
        break
      }

      if (input[i] === '"') {
        result += '\\'.repeat(slashCount * 2 + 1)
        result += input[i]
      } else {
        result += '\\'.repeat(slashCount)
        result += input[i]
      }
    }
    result += '"'
  }

  // and finally, prefix shell meta chars with a ^
  result = result.replace(/[!^&()<>|"]/g, '^$&')
  // except for % which is escaped with another %
  result = result.replace(/%/g, '%%')

  return result
}

const sh = (input) => {
  if (!input.length) {
    return `''`
  }

  if (!/[\t\n\r "#$&'()*;<>?\\`|~]/.test(input)) {
    return input
  }

  // replace single quotes with '\'' and wrap the whole result in a fresh set of quotes
  const result = `'${input.replace(/'/g, `'\\''`)}'`
    // if the input string already had single quotes around it, clean those up
    .replace(/^(?:'')+(?!$)/, '')
    .replace(/\\'''/g, `\\'`)

  return result
}

module.exports = {
  cmd,
  sh,
}