module.exports = function(app){
  require('./admin/routes')(app);
  require('./site/routes')(app);
};
