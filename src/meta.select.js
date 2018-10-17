Meta.select=(function()
{
  // a CSS rules
  // b Context
  return function(a,b)
  {
    b=b||document;
    return Meta.obj2array(b.querySelectorAll(a));
  };
}());
