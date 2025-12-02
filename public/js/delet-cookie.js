const button = document.querySelector("#updateForm")
const value = `; ${document.cookie}`;
const parts = value.split(`; jwt=`);
let token = "";
if (parts.length === 2) {
  token = parts.pop().split(";").shift();
}

const btn = document.getElementById("myButton");

btn.addEventListener("click", function () {
  console.log("Button was clicked!");
});
