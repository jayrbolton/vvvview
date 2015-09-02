// utils for saving and loading from local storage

module.exports = {
  save: function(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj))
  },
  load: funciton(key) {
    var saved = localStorage.getItem(key)
    if(saved) return JSON.parse(saved)
  }
}

