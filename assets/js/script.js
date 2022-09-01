// Javascript file
console.log("My javascript is working");

(function () {
    var burger = document.querySelector('.burger');
    var burgerMenu = document.querySelector('#' + burger.dataset.target);
    burger.addEventListener('click', function() {
        burger.classList.toggle('is-active');
        burgerMenu.classList.toggle
    });
})();