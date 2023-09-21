var cur_ul = document.getElementById("banner");
var arr = new Array();
for (i = 1; i <= 3; i++) {
var cur_li = document.createElement("li");
var cur_img = document.createElement("img");
cur_img.src = "images/" + i + ".jpg";
cur_img.style.width = "350px";
cur_img.style.height = "255px";
cur_li.appendChild(cur_img);
cur_ul.appendChild(cur_li);
cur_ul.onmouseenter = function () {
  clearInterval(timer);
};
cur_ul.onmouseleave = function () {
  timer = setInterval(get_next, 3000);
};
arr.push(cur_li);
}
var len = arr.length - 1;
arr[len - 2].style.left = "0px";
arr[len - 1].style.left = "200px";
arr[len].style.left = "400px";
arr[len - 1].style.transform = "scale(1.3)";
arr[len - 1].style.zIndex = 100;
function get_next() {
var give_up = arr[arr.length - 1];
arr.pop();
arr.unshift(give_up);
for (var i = 0; i < arr.length; i++) {
  arr[i].style.zIndex = i;
  arr[i].style.transform = "scale(1)";
}
arr[len - 2].style.left = "0px";
arr[len - 1].style.left = "200px";
arr[len].style.left = "400px";
arr[len - 1].style.transform = "scale(1.3)";
arr[len - 1].style.zIndex = 100;
}
var timer = setInterval(get_next, 3000);
var pre_img = document.createElement("img");
pre_img.src = "images/pre-icon.png";
pre_img.style.position = "absolute";
pre_img.style.width = "20px";
pre_img.style.top = 0;
pre_img.style.bottom = 0;
pre_img.style.left = 0;
pre_img.style.margin = "auto";
pre_img.style.zIndex = 100;
cur_ul.appendChild(pre_img);
var next_img = document.createElement("img");
next_img.src = "images/next-icon.png";
next_img.style.position = "absolute";
next_img.style.width = "20px";
next_img.style.top = 0;
next_img.style.bottom = 0;
next_img.style.right = 0;
next_img.style.margin = "auto";
next_img.style.zIndex = 100;
cur_ul.appendChild(next_img);
pre_img.onclick = function () {
get_pre();
};
next_img.onclick = function () {
get_next();
};
function get_pre() {
var give_up = arr[0];
arr.shift();
arr.push(give_up);
for (var i = 0; i < arr.length; i++) {
  arr[i].style.zIndex = i;
  arr[i].style.transform = "scale(1)";
}
arr[len - 2].style.left = "0px";
arr[len - 1].style.left = "200px";
arr[len].style.left = "400px";
arr[len - 1].style.transform = "scale(1.3)";
arr[len - 1].style.zIndex = 100;
}