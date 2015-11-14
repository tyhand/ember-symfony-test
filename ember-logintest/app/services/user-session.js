export default Ember.Service.extend({
    isAuthenticated: false,

    login(username, password) {
        return new Promise((resolve, reject)=>{
        if (userName === 'test' && password === 'test'){
           //get user from somewhere
           this.set('isAuthenticated', true)
           resolve()
        } else {
           reject("Username and password did not match")
        }
      })
    }
});
