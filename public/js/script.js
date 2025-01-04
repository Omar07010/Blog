document.addEventListener('DOMContentLoaded', () => {
    const allButtons = document.querySelectorAll('.searchBtn');
    const searchBar = document.querySelector('.searchBar');
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.getElementById('searchClose');

    // إضافة مستمع للحدث لكل زر
    allButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            searchBar.style.visibility = 'visible';
            searchBar.classList.add('open');
            event.currentTarget.setAttribute('aria-expanded', 'true');
            searchInput.focus();
        });
    });

    // إضافة مستمع للحدث على زر الإغلاق
    searchClose.addEventListener('click', () => {
        searchBar.style.visibility = 'hidden';
        searchBar.classList.remove('open');
        // عند إغلاق شريط البحث، يمكن تعيين خاصية aria-expanded للعناصر التي تفتح شريط البحث إلى false.
        allButtons.forEach(button => {
            button.setAttribute('aria-expanded', 'false');
        });
    });
});



// document.addEventListener('DOMContentLoaded', () => {
//     const allButtons = document.querySelectorAll('.searchBtn');
//     const searchBar = document.querySelector('.searchBar');
//     const searchInput = document.getElementById('searchInput');
//     const searchClose = document.getElementById('searchClose');

//     for (let i = 0; i < allButtons.length; i++) {
//         allButtons[i].addEventListener('click', () => {
//             searchBar.style.visibility = 'visible';
//             searchBar.classList.add('open');
//             // this.setAttribute('aria-expanded', 'true');
//             event.currentTarget.setAttribute('aria-expanded', 'true');
//             searchInput.focus()
//         })
        
//     }
//     allButtons.addEventListener('click', () => {
//         searchBar.style.visibility = 'hidden';
//         searchBar.classList.remove('open');
//         // this.setAttribute('aria-expanded', 'false');
//         event.currentTarget.setAttribute('aria-expanded', 'false');
//     })
// })