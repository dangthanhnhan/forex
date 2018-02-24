module.exports = {
    to: function(promise) {
        return promise.then(data => {
            return [null, data];
        })
        .catch(err => [err]);
    },
    validateEmail: function(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },
    isEmptyObject: function(obj) {
        return JSON.stringify(obj) === JSON.stringify({});
    },
    log: function(data, title) {
        title = title || 'DATA';
        console.log('============== ' + title + ' ==================');
        console.log(data);
        console.log('========================================');
    },
    random: function(start, end) {
        return Math.floor((Math.random() * end) + start);
    }
}