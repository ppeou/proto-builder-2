const toggleSpinner = () => {
  if (iid) {
    clearInterval(iid);
    iid = null;
    process.stdout.write('\b');
    return;
  }
  const P = ["\\", "|", "/", "-"];
  let x = 0;
  process.stdout.write(' ');
  iid = setInterval(function () {
    process.stdout.write("\b" + P[x++]);
    x &= 3;
  }, 250);
};

module.exports = toggleSpinner;